-- LifeOS Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- Enable UUID extension (usually enabled by default)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inbox Table
CREATE TABLE IF NOT EXISTS inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Inbox Policies: Users can only see/modify their own inbox items
CREATE POLICY "Users can view own inbox" ON inbox
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inbox" ON inbox
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inbox" ON inbox
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks Policies: Users can only see/modify their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inbox_user_id ON inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_created_at ON inbox(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority DESC);
