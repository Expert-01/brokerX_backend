-- 1. Lookup Tables

CREATE TABLE IF NOT EXISTS plans (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS deposit_methods (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS deposit_statuses (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id     SERIAL PRIMARY KEY,
  symbol VARCHAR(20) UNIQUE NOT NULL,
  name   TEXT
);

CREATE TABLE IF NOT EXISTS investment_statuses (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);


-- 2. Core Tables

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      TEXT       UNIQUE NOT NULL,
  password   TEXT       NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deposits (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL
               REFERENCES users(id)
               ON DELETE CASCADE,
  plan_id    INTEGER NOT NULL
               REFERENCES plans(id),
  method_id  INTEGER NOT NULL
               REFERENCES deposit_methods(id),
  status_id  INTEGER NOT NULL
               REFERENCES deposit_statuses(id),
  amount     NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investments (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL
                   REFERENCES users(id)
                   ON DELETE CASCADE,
  asset_id       INTEGER NOT NULL
                   REFERENCES assets(id),
  status_id      INTEGER NOT NULL
                   REFERENCES investment_statuses(id),
  quantity       NUMERIC(20,8) NOT NULL,
  price_per_unit NUMERIC(20,8) NOT NULL,
  created_at     TIMESTAMPTZ        DEFAULT NOW()
);


-- 3. Seed Lookup Data

INSERT INTO plans(name) VALUES
  ('Starter'), ('Growth'), ('Pro')
ON CONFLICT DO NOTHING;

INSERT INTO deposit_methods(name) VALUES
  ('card'), ('bank_transfer'), ('crypto')
ON CONFLICT DO NOTHING;

INSERT INTO deposit_statuses(name) VALUES
  ('pending'), ('completed'), ('failed')
ON CONFLICT DO NOTHING;

INSERT INTO assets(symbol, name) VALUES
  ('BTC', 'Bitcoin'),
  ('ETH', 'Ethereum'),
  ('USDT', 'Tether')
ON CONFLICT DO NOTHING;

INSERT INTO investment_statuses(name) VALUES
  ('open'), ('closed'), ('cancelled')
ON CONFLICT DO NOTHING;
