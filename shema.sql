-- 1. PLANS Lookup
CREATE TABLE IF NOT EXISTS plans (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. DEPOSIT METHODS Lookup
CREATE TABLE IF NOT EXISTS deposit_methods (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 3. DEPOSIT STATUSES Lookup
CREATE TABLE IF NOT EXISTS deposit_statuses (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- 4. USERS
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      TEXT       UNIQUE NOT NULL,
  password   TEXT       NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEPOSITS (references lookups instead of varchars)
CREATE TABLE IF NOT EXISTS deposits (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,
  plan_id      INTEGER NOT NULL
                REFERENCES plans(id),
  method_id    INTEGER NOT NULL
                REFERENCES deposit_methods(id),
  status_id    INTEGER NOT NULL
                REFERENCES deposit_statuses(id),
  amount       NUMERIC(12,2) NOT NULL,
  created_at   TIMESTAMP WITHOUT TIME ZONE
                DEFAULT CURRENT_TIMESTAMP
);

-- 6. ASSETS Lookup
CREATE TABLE IF NOT EXISTS assets (
  id     SERIAL PRIMARY KEY,
  symbol VARCHAR(20) UNIQUE NOT NULL,
  name   TEXT
);

-- 7. INVESTMENT STATUSES Lookup
CREATE TABLE IF NOT EXISTS investment_statuses (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- 8. INVESTMENTS (references asset & status lookups)
CREATE TABLE IF NOT EXISTS investments (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL
                   REFERENCES users(id)
                   ON DELETE CASCADE,
  asset_id        INTEGER NOT NULL
                   REFERENCES assets(id),
  status_id       INTEGER NOT NULL
                   REFERENCES investment_statuses(id),
  quantity        NUMERIC(20,8) NOT NULL,
  price_per_unit  NUMERIC(20,8) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


