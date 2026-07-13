-- =============================================================================
-- FLOWSTATE — Initial Schema (Conceptual)
-- Database: PostgreSQL (assumed)
-- Status: DRAFT — not yet applied
-- =============================================================================

-- This schema is a conceptual starting point.
-- Apply via migration tooling, not directly.

-- Users (authentication identity)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider VARCHAR(50) NOT NULL DEFAULT 'guest',
  external_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Player Profiles (public player data)
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  display_name VARCHAR(50),
  avatar_id VARCHAR(100),
  total_sessions INTEGER NOT NULL DEFAULT 0,
  total_score BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);

-- Game Sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  mode VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);

-- Game Results (server-validated)
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  score INTEGER NOT NULL,
  max_combo INTEGER NOT NULL DEFAULT 0,
  max_harmony REAL NOT NULL DEFAULT 0,
  energy_collected INTEGER NOT NULL DEFAULT 0,
  duration_seconds REAL NOT NULL DEFAULT 0,
  is_validated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_game_results_user_id ON game_results(user_id);
CREATE INDEX idx_game_results_session_id ON game_results(session_id);

-- Leaderboard Entries (server-validated scores only)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  score INTEGER NOT NULL,
  rank INTEGER,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_entries_board_score ON leaderboard_entries(board_id, score DESC);
CREATE INDEX idx_leaderboard_entries_user_id ON leaderboard_entries(user_id);
