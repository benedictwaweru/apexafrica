pid_file = "/vault/agent-sink/pidfile"

vault {
  address = "https://vault-server:8200"
  ca_cert = "/vault/certs/rootCA.pem"
}

auto_auth {
  method "approle" {
    mount_path = "auth/approle"

    config = {
      role_id_file_path                   = "/vault/config/role_id"
      secret_id_file_path                 = "/vault/config/secret_id"
      # Set to true once you're past initial testing — Vault will delete the
      # secret_id file after first successful read, matching wrap-once semantics.
      remove_secret_id_file_after_reading = false
    }
  }

  sink "file" {
    config = {
      path = "/vault/agent-sink/token"
    }
  }
}

# Lets other containers on vault-net hit the agent for cached/templated
# secrets instead of talking to vault-server directly.
listener "tcp" {
  address     = "0.0.0.0:8100"
  tls_disable = true
}

cache {
  cache_static_secrets = true
}

# Renders to 0644 deliberately: postgres's docker-entrypoint.sh runs its
# _FILE-reading logic as root before dropping to the postgres user, so
# strict perms aren't required for that read — 0644 just keeps this simple
# and avoids UID/GID coordination between the two containers.
template {
  source      = "/vault/templates/postgres-user.tpl"
  destination = "/vault/agent-sink/postgres-user"
  perms       = "0644"
}

template {
  source      = "/vault/templates/postgres-password.tpl"
  destination = "/vault/agent-sink/postgres-password"
  perms       = "0644"
}

template {
  source      = "/vault/templates/postgres-db.tpl"
  destination = "/vault/agent-sink/postgres-db"
  perms       = "0644"
}
