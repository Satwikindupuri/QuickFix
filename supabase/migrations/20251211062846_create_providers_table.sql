/*
  # Create providers table for HelpHub

  1. New Tables
    - `providers`
      - `id` (uuid, primary key)
      - `uid` (uuid, references auth.users)
      - `name` (text)
      - `firm_name` (text)
      - `category` (text)
      - `city` (text)
      - `phone` (text)
      - `description` (text)
      - `experience_years` (integer)
      - `price` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `providers` table
    - Add policy for anyone to view providers
    - Add policy for authenticated users to create providers
    - Add policy for users to update their own provider entries
    - Add policy for users to delete their own provider entries
*/

CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uid uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  firm_name text NOT NULL,
  category text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  description text NOT NULL,
  experience_years integer DEFAULT 0,
  price text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view providers"
  ON providers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create providers"
  ON providers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uid);

CREATE POLICY "Users can update own providers"
  ON providers FOR UPDATE
  TO authenticated
  USING (auth.uid() = uid)
  WITH CHECK (auth.uid() = uid);

CREATE POLICY "Users can delete own providers"
  ON providers FOR DELETE
  TO authenticated
  USING (auth.uid() = uid);

CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_uid ON providers(uid);