PRAGMA foreign_keys = ON;

CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learners (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  alias TEXT NOT NULL COLLATE NOCASE,
  pin_hash TEXT NOT NULL,
  pin_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, alias)
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learner_state (
  learner_id TEXT PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
  lesson_index INTEGER NOT NULL DEFAULT 0 CHECK(lesson_index BETWEEN 0 AND 5),
  level INTEGER NOT NULL DEFAULT 1 CHECK(level BETWEEN 1 AND 3),
  streak INTEGER NOT NULL DEFAULT 0 CHECK(streak >= 0),
  diagnostic_done INTEGER NOT NULL DEFAULT 0 CHECK(diagnostic_done IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response_json TEXT NOT NULL,
  score REAL NOT NULL CHECK(score BETWEEN 0 AND 1),
  attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mastery (
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  best_score REAL NOT NULL CHECK(best_score BETWEEN 0 AND 1),
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK(attempt_count > 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (learner_id, question_id)
);

CREATE INDEX idx_learners_class ON learners(class_id);
CREATE INDEX idx_sessions_learner ON sessions(learner_id);
CREATE INDEX idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX idx_attempts_learner_time ON attempts(learner_id, attempted_at DESC);
CREATE INDEX idx_mastery_learner ON mastery(learner_id);
