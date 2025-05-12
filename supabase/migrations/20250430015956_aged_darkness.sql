/*
  # Fix profile constraints and add default profile creation

  1. Changes
    - Add trigger to automatically create user profile on auth.user creation
    - Add function to handle profile creation
    - Update RLS policies to handle profile creation

  2. Security
    - Maintain existing RLS policies
    - Add specific policy for profile creation
*/

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DO $$ BEGIN
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Ensure profile creation is allowed
CREATE POLICY "Allow profile creation for new users"
  ON users_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates a user profile when a new user signs up';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Ensures every user has a profile';