storage "raft" {
  path    = "/vault/data"
  node_id = "vault-server-1"
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_cert_file = "/vault/certs/vault-server.pem"
  tls_key_file  = "/vault/certs/vault-server-key.pem"
}

# IPC_LOCK is a no-op in the official image as of Vault 2.0.2+, so mlock
# can't actually be used inside this container regardless of cap_add.
# Disabling it explicitly avoids a startup warning/failure.
disable_mlock = true

api_addr     = "https://vault-server:8200"
cluster_addr = "https://vault-server:8201"

ui = true
