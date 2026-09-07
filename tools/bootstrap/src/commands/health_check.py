#!/usr/bin/env python3
"""
health_check.py — Verify every service is up and healthy.

Usage:
    python health_check.py                       # check all services
    python health_check.py --services api redis  # specific services
    python health_check.py --watch               # keep polling every 5s
    python health_check.py --json               # machine-readable output

Exit code 0 = all healthy, 1 = one or more unhealthy / timeout.

K8s migration notes:
  - This script doubles as a readiness/liveness probe runner in CI pipelines.
  - In K8s you'd also define readinessProbe / livenessProbe in the Pod spec;
    keep this script for integration smoke-tests and local dev.
"""
