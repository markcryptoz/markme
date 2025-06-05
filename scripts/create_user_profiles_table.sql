-- Update the comment to reflect new brand name
-- Create user_profiles table for FUN FANS PLAY authentication
CREATE TABLE IF NOT EXISTS user_profiles (
  wallet_address TEXT PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  interests TEXT[],
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert a test user to verify the table works
INSERT INTO user_profiles (wallet_address, username, name, bio, interests) 
VALUES (
  '0x1234567890123456789012345678901234567890',
  'test_user',
  'Test User',
  'This is a test user for FUN FANS PLAY',
  ARRAY['basketball', 'football', 'soccer']
) ON CONFLICT (wallet_address) DO NOTHING;
