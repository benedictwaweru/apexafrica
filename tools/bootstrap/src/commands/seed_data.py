#!/usr/bin/env python3
"""
seed_data.py — Generic data-driven seeder for Postgres and Redis.

The seeder infrastructure is completely domain-agnostic. To seed any entity:

  1. Define a factory function:
         def build_orders(fake, ids) -> list[dict]: ...

  2. Register it as an EntitySeeder (Postgres) or RedisSeeder:
         EntitySeeder(
             model        = Order,
             factory      = build_orders,
             name         = "orders",
             unique_field = "order_number",   # used for idempotency
             id_key       = "order_ids",      # key stored in seeded_ids for FK refs
             depends_on   = ["user_ids"],     # ids that must be seeded first
         )

  3. Add it to POSTGRES_SEEDERS (or REDIS_SEEDERS) in the right position.

That's it. No registry, no decorators, no graph algorithm. Dependency order
is explicit from the list position. Cross-table FK references are passed
through the `ids` dict that every factory receives.

Commands:
    all        Run all seeders  (default)
    postgres   Seed Postgres only
    redis      Seed Redis only
    api        Seed REST API only
    list       List all registered seeders

K8s migration: wrap in a K8s Job / init container.

Dependencies:
    pip install sqlalchemy psycopg2-binary redis uuid6 faker typer
"""
