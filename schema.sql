-- Run this once in the Neon SQL Editor (or `psql $DATABASE_URL -f schema.sql`).

CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  company     VARCHAR(100),
  service     VARCHAR(60),
  message     TEXT          NOT NULL,
  status      VARCHAR(20)   NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_messages_status_idx     ON contact_messages (status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);
