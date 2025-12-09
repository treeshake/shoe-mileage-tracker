CREATE TABLE IF NOT EXISTS smt.shoes (
  id          SERIAL PRIMARY KEY,
  brand       TEXT,                     
  model       TEXT,                     
  retired     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE smt.shoes
ADD CONSTRAINT shoes_brand_model_unique
UNIQUE (brand, model);

CREATE TABLE smt.run_types (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,   -- e.g. "Easy", "Tempo", "Race"
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE smt.runs (
  id           SERIAL PRIMARY KEY,
  date         DATE NOT NULL,
  distance_km  NUMERIC(6,2) NOT NULL,
  shoe_id      INTEGER NOT NULL REFERENCES smt.shoes(id) ON DELETE RESTRICT,
  run_type_id  INTEGER NOT NULL REFERENCES smt.run_types(id) ON DELETE RESTRICT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW smt.run_details_view AS
SELECT
    r.id AS run_id,
    r.date,
    r.distance_km,
    r.notes,
    r.created_at,

    -- Shoe fields
    s.id AS shoe_id,
    s.brand AS shoe_brand,
    s.model AS shoe_model,
    s.retired AS shoe_retired,
    s.created_at AS shoe_created_at,

    -- Run type fields
    rt.id AS run_type_id,
    rt.name AS run_type_name,
    rt.created_at AS run_type_created_at

FROM smt.runs r
JOIN smt.shoes s ON r.shoe_id = s.id
JOIN smt.run_types rt ON r.run_type_id = rt.id

ORDER BY r.date DESC, r.id DESC;

-- api

CREATE TABLE IF NOT EXISTS api.api_keys (
  id SERIAL PRIMARY KEY,
  key_hash TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT FALSE
);
