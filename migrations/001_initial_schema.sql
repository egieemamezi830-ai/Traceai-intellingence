-- This is a placeholder migration file.
-- Full schema migrations will be generated separately.
-- For now, use Supabase's migration tools or SQL directly.

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'business', 'enterprise');
CREATE TYPE account_type AS ENUM ('checking', 'savings', 'credit_card', 'debit_card', 'investment', 'loan', 'other');
CREATE TYPE transaction_type AS ENUM ('purchase', 'refund', 'transfer_sent', 'transfer_received', 'deposit', 'withdrawal', 'fee', 'other');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  country CHAR(2) NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  preferred_currency CHAR(3) NOT NULL DEFAULT 'USD',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
