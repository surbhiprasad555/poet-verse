/*
  # Create poems table and setup RLS policies

  1. New Tables
    - `poems`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `poems` table
    - Add policies for:
      - Users can read all poems
      - Users can only create/update/delete their own poems
*/

CREATE TABLE IF NOT EXISTS poems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- Allow users to read all poems
CREATE POLICY "Anyone can read poems"
  ON poems
  FOR SELECT
  USING (true);

-- Allow authenticated users to create their own poems
CREATE POLICY "Users can create their own poems"
  ON poems
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own poems
CREATE POLICY "Users can update their own poems"
  ON poems
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own poems
CREATE POLICY "Users can delete their own poems"
  ON poems
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);