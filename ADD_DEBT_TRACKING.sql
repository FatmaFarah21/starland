-- ============================================================================
-- DEBT TRACKING MIGRATION - Add amount_paid and amount_remaining to sales
-- ============================================================================
-- Run this script if you already have a sales table without these columns

-- Add the new columns if they don't exist
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS amount_remaining NUMERIC(12, 2) DEFAULT 0;

-- Update existing records to calculate amount_remaining
UPDATE sales
SET amount_remaining = CASE 
    WHEN amount_paid IS NULL THEN total_amount
    ELSE GREATEST(0, total_amount - amount_paid)
END
WHERE amount_remaining IS NULL OR amount_remaining = 0;

-- Create index for faster debt reporting
CREATE INDEX IF NOT EXISTS idx_sales_amount_remaining ON sales(amount_remaining);

-- Optional: Create a trigger to automatically calculate amount_remaining on insert/update
CREATE OR REPLACE FUNCTION update_amount_remaining()
RETURNS TRIGGER AS $$
BEGIN
    NEW.amount_remaining := GREATEST(0, NEW.total_amount - COALESCE(NEW.amount_paid, 0));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sales_amount_remaining_trigger ON sales;
CREATE TRIGGER sales_amount_remaining_trigger
BEFORE INSERT OR UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_amount_remaining();
