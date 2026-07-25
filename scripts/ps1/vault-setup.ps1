<#
.SYNOPSIS
  Automates first-time setup of the vault-server / vault-agent Docker Compose
  stack: TLS cert generation, container startup, init, unseal, login, AppRole
  policy/role creation, and role_id/secret_id extraction for the agent.

.PARAMETER Reset
  Tears down containers and volumes first, deletes init-output.txt and any
  existing role_id/secret_id, and starts completely fresh. Use this if a
  previous run left volumes in a bad state (wrong ownership, partial init).

.EXAMPLE
  .\setup.ps1
  .\setup.ps1 -Reset

.NOTES
  Safe to re-run without -Reset: cert generation, init, and role_id/secret_id
  extraction are all skipped if their output already exists on disk. Policy
  and AppRole role writes are idempotent on the Vault side regardless.
#>

param(
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function ExecVault {
    param([string[]]$VaultArgs)
    docker compose exec -e VAULT_CACERT=/vault/certs/ca.pem vault-server vault @VaultArgs
    if ($LASTEXITCODE -ne 0) {
        throw "vault $($VaultArgs -join ' ') failed with exit code $LASTEXITCODE"
    }
}

if ($Reset) {
    Step "Resetting: tearing down containers and volumes"
    docker compose down -v
    Remove-Item -Force -ErrorAction SilentlyContinue .\init-output.txt
    Remove-Item -Force -ErrorAction SilentlyContinue .\vault-agent\config\role_id
    Remove-Item -Force -ErrorAction SilentlyContinue .\vault-agent\config\secret_id
}

# 1. TLS certs (mkcert)
$certFiles = @(
    ".\vault-server\certs\vault-server.pem",
    ".\vault-server\certs\vault-server-key.pem",
    ".\vault-server\certs\ca.pem",
    ".\vault-agent\certs\ca.pem"
)
$missingCerts = $certFiles | Where-Object { -not (Test-Path $_) }
if ($missingCerts) {
    Step "Generating TLS certs with mkcert"
    if (-not (Get-Command mkcert -ErrorAction SilentlyContinue)) {
        throw "mkcert not found on PATH. Install it first: https://github.com/FiloSottile/mkcert"
    }
    mkcert -install
    Push-Location .\vault-server\certs
    mkcert -cert-file vault-server.pem -key-file vault-server-key.pem vault-server localhost 127.0.0.1
    Copy-Item "$(mkcert -CAROOT)\rootCA.pem" ca.pem -Force
    Pop-Location
    Copy-Item .\vault-server\certs\ca.pem .\vault-agent\certs\ca.pem -Force
}
else {
    Step "TLS certs already present, skipping generation"
}

# 2. Fix volume ownership, then start the server
Step "Running vault-data-init (fixes named volume ownership for the non-root vault user)"
docker compose up -d vault-data-init
if ($LASTEXITCODE -ne 0) { throw "vault-data-init failed" }

Step "Starting vault-server"
docker compose up -d vault-server
if ($LASTEXITCODE -ne 0) { throw "vault-server failed to start" }

Step "Waiting for vault-server healthcheck"
$timeoutSeconds = 60
$elapsed = 0
while ($true) {
    $status = docker inspect --format="{{.State.Health.Status}}" vault-server 2>$null
    if ($status -eq "healthy") { break }
    if ($elapsed -ge $timeoutSeconds) {
        throw "vault-server did not become healthy within $timeoutSeconds s (last status: $status). Check: docker compose logs vault-server"
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
}

# 3. Init (skip if already done)
if (-not (Test-Path .\init-output.txt)) {
    Step "Initializing Vault (single key share/threshold — dev only)"
    docker compose exec -e VAULT_CACERT=/vault/certs/ca.pem vault-server sh -c `
        "vault operator init -key-shares=1 -key-threshold=1 > /tmp/init-output.txt 2>&1"
    docker compose cp vault-server:/tmp/init-output.txt .\init-output.txt
}
else {
    Step "init-output.txt already exists, skipping init"
}

$initContent = Get-Content .\init-output.txt -Raw
if ($initContent -notmatch "Unseal Key 1:\s*(\S+)") {
    throw "Could not find unseal key in init-output.txt. Contents:`n$initContent"
}
$unsealKey = $Matches[1]

if ($initContent -notmatch "Initial Root Token:\s*(\S+)") {
    throw "Could not find root token in init-output.txt. Contents:`n$initContent"
}
$rootToken = $Matches[1]

# 4. Unseal + login (both safe to repeat)
Step "Unsealing Vault"
ExecVault @("operator", "unseal", $unsealKey) | Out-Null

Step "Logging in as root"
ExecVault @("login", $rootToken) | Out-Null

# 5. Policy (upsert — safe to repeat)
Step "Writing agent-policy"
ExecVault @("policy", "write", "agent-policy", "/vault/policies/agent-policy.hcl") | Out-Null

# 6. AppRole (upsert — safe to repeat; auth enable errors harmlessly if already enabled)
Step "Enabling AppRole auth method"
docker compose exec -e VAULT_CACERT=/vault/certs/ca.pem vault-server vault auth enable approle 2>&1 |
    ForEach-Object { if ($_ -notmatch "path is already in use") { $_ } }

Step "Enabling KV v2 secrets engine at secret/"
docker compose exec -e VAULT_CACERT=/vault/certs/ca.pem vault-server vault secrets enable -path=secret -version=2 kv 2>&1 |
    ForEach-Object { if ($_ -notmatch "path is already in use") { $_ } }

Step "Creating agent-role"
ExecVault @("write", "auth/approle/role/agent-role", "token_policies=agent-policy", "token_ttl=1h", "token_max_ttl=4h") | Out-Null

if (-not (Test-Path .\vault-agent\config\role_id) -or -not (Test-Path .\vault-agent\config\secret_id)) {
    Step "Extracting role_id / secret_id for the agent"
    docker compose exec -e VAULT_CACERT=/vault/certs/ca.pem vault-server sh -c `
        "vault read -field=role_id auth/approle/role/agent-role/role-id > /tmp/role_id"
    docker compose exec -e VAULT_CACERT=/vault/certs/ca.pem vault-server sh -c `
        "vault write -field=secret_id -f auth/approle/role/agent-role/secret-id > /tmp/secret_id"
    docker compose cp vault-server:/tmp/role_id .\vault-agent\config\role_id
    docker compose cp vault-server:/tmp/secret_id .\vault-agent\config\secret_id
}
else {
    Step "role_id / secret_id already present, skipping (delete both manually to force regeneration)"
}

# 7. Bring up the agent
Step "Starting vault-agent"
docker compose up -d vault-agent
if ($LASTEXITCODE -ne 0) { throw "vault-agent failed to start" }

Step "Setup complete. Tailing vault-agent logs (Ctrl+C to stop tailing — containers keep running)"
docker compose logs -f vault-agent
