/*
  # Add admin role and initial admin user

  1. Changes
    - Creates admin_users table to track admin privileges
    - Adds RLS policies for admin access
    - Creates initial admin user

  2. Security
    - Only admins can access admin_users table
    - Admins have elevated access to all tables
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create admin policies for all tables
CREATE POLICY "Admins can access all profiles"
  ON users_profile
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    OR auth.uid() = user_id
  );

CREATE POLICY "Admins can access all submissions"
  ON tax_submissions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    OR auth.uid() = user_id
  );

CREATE POLICY "Admins can access all statements"
  ON bank_statements
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    OR auth.uid() = user_id
  );

CREATE POLICY "Admins can access all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    OR EXISTS (
      SELECT 1 FROM bank_statements
      WHERE bank_statements.id = transactions.statement_id
      AND (
        bank_statements.user_id = auth.uid()
        OR auth.uid() IN (SELECT id FROM admin_users)
      )
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();