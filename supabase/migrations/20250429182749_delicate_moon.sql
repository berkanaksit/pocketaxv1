/*
  # Add file storage fields

  1. New Fields
    - `bank_statements`
      - `file_path` (text): Storage path for the uploaded file
      - `file_type` (text): MIME type of the uploaded file
      - `processed_at` (timestamptz): When the file was processed
      
  2. Changes
    - Added indexes for faster queries
    - Added validation check for file types
*/

ALTER TABLE bank_statements
ADD COLUMN file_path text,
ADD COLUMN file_type text,
ADD COLUMN processed_at timestamptz;

-- Add check constraint for allowed file types
ALTER TABLE bank_statements
ADD CONSTRAINT valid_file_type CHECK (
  file_type IN ('application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
);

-- Add index for faster status queries
CREATE INDEX idx_bank_statements_status ON bank_statements(status);

-- Add index for date range queries
CREATE INDEX idx_bank_statements_period ON bank_statements(statement_period_start, statement_period_end);