/*
  # Add transaction categorization

  1. New Types
    - transaction_category: Enum for categorizing transactions
    - processing_status: Enum for statement processing status

  2. Changes
    - Add processing metadata to bank_statements
    - Convert status column to use enum
    - Add confidence score for categorization
    - Add performance indexes
*/

-- Add transaction categories enum
CREATE TYPE transaction_category AS ENUM (
  'income_self_employment',
  'income_employment',
  'income_investments',
  'income_other',
  'expense_office',
  'expense_travel',
  'expense_equipment',
  'expense_legal',
  'expense_marketing',
  'expense_training',
  'expense_other'
);

-- Add processing status enum
CREATE TYPE processing_status AS ENUM (
  'pending',
  'processing',
  'processed',
  'failed'
);

-- Update bank_statements table
ALTER TABLE bank_statements
  ADD COLUMN processing_error text,
  ADD COLUMN transaction_count integer DEFAULT 0;

-- Convert status column to use enum
ALTER TABLE bank_statements 
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE processing_status USING 
    CASE status 
      WHEN 'processing' THEN 'processing'::processing_status
      ELSE 'pending'::processing_status
    END;

ALTER TABLE bank_statements
  ALTER COLUMN status SET DEFAULT 'pending'::processing_status;

-- Update transactions table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE transactions ADD COLUMN category transaction_category;
  END IF;
END $$;

ALTER TABLE transactions
  ADD COLUMN confidence float DEFAULT 0.0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_statements_status ON bank_statements(status);

-- Add constraint for minimum transaction amount
ALTER TABLE transactions
  ADD CONSTRAINT valid_amount CHECK (amount != 0);

COMMENT ON COLUMN transactions.confidence IS 'Confidence score for automatic categorization (0-1)';
COMMENT ON COLUMN bank_statements.processing_error IS 'Error message if processing failed';
COMMENT ON COLUMN bank_statements.transaction_count IS 'Number of transactions extracted from statement';