CREATE TABLE IF NOT EXISTS traces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS traces_created_at ON traces(created_at DESC);
