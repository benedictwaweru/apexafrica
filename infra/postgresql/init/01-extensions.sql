-- UUID generation (primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fuzzy text search (searching shipments, carriers, users)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- GIN indexes on scalar types (faster filtering)
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Faster LIKE/ILIKE queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Case insensitive text type
CREATE EXTENSION IF NOT EXISTS "citext";
