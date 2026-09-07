#!/usr/bin/env python3
"""
docker_services.py — Start (or stop/restart) Docker Compose services.

Usage:
    python docker_services.py                    # start all services
    python docker_services.py --services api db  # start specific services
    python docker_services.py --action stop
    python docker_services.py --action restart --services redis

K8s migration notes:
  - Replace docker-compose up with `kubectl apply -f k8s/`
  - Service discovery switches from localhost to K8s Service DNS automatically
    because hosts are already read from env vars in config.py.
"""
