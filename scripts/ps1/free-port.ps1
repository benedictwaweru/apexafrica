param (
  [Parameter(Mandatory)]
  [ValidateRange(1, 65535)]
  [int]$Port
)

function Get-ProcessesOnPort {
  param([int]$Port)

  $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  if (-not $connections) {
    $connections = Get-NetUDPEndpoint -LocalPort $Port -ErrorAction SilentlyContinue
  }

  return $connections
}

Write-Host "`nScanning port $Port..." -ForegroundColor Cyan

$connections = Get-ProcessesOnPort -Port $Port

if (-not $connections) {
  Write-Host "Port $Port is already free. Nothing to do.`n" -ForegroundColor Green
  exit 0
}

# Collect unique PIDs
$procIds = $connections.OwningProcess | Sort-Object -Unique

foreach ($procId in $procIds) {
  $process = Get-Process -Id $procId -ErrorAction SilentlyContinue

  if (-not $process) {
    Write-Warning "PID $procId no longer exists. Skipping."
    continue
  }

  Write-Host "`nFound process holding port ${Port}:" -ForegroundColor Yellow
  Write-Host "  Name : $($process.Name)"
  Write-Host "  PID  : $procId"
  Write-Host "  Path : $($process.Path ?? 'N/A')"

  $confirm = Read-Host "`nKill '$($process.Name)' (PID $procId)? [y/N]"

  if ($confirm -match '^[Yy]$') {
    try {
      Stop-Process -Id $procId -Force
      Write-Host "Killed PID $procId." -ForegroundColor Green
    } catch {
      Write-Error "Failed to kill PID ${procId}: $_"
    }
  } else {
    Write-Host "Skipped PID $procId." -ForegroundColor DarkGray
  }
}

# Verify
Start-Sleep -Milliseconds 500
$remaining = Get-ProcessesOnPort -Port $Port

if ($remaining) {
  Write-Host "`nPort $Port still has active connections. Some processes may need more time to release it.`n" -ForegroundColor Yellow
} else {
  Write-Host "`nPort $Port is now free.`n" -ForegroundColor Green
}
