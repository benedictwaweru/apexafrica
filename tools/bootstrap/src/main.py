#!/usr/bin/env python3
"""
main.py — Orchestrate the full dev-environment bootstrap in order:

  1. install_deps   — install Node / Maven / Gradle / Python dependencies
  2. vault_agent    — start Vault Agent (background)
  3. docker_services — start Docker Compose services and wait for readiness
  4. seed_data      — seed initial data
  5. health_check   — verify everything is healthy

Usage:
    python main.py                          # full bootstrap
    python main.py --skip vault seed        # skip specific steps
    python main.py --only docker health     # run only specific steps
    python main.py --env staging            # use staging fixtures
    python main.py --ci                     # CI mode (frozen installs, fail-fast)

Exit code 0 = all steps passed, 1 = one or more steps failed.

K8s migration notes:
  - Replace this script with a CI pipeline (GitHub Actions / GitLab CI).
  - install_deps  → Dockerfile RUN layer
  - vault_agent   → Vault Agent sidecar or Vault Secrets Operator
  - docker_services → helm install / kubectl apply
  - seed_data     → K8s Job (init container)
  - health_check  → readinessProbe / smoke-test Job
"""
