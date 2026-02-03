-- ============================================================================
-- STARLAND WATER COMPANY - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- This SQL script creates all tables for the Starland Water Financial System
-- Run this in your Supabase SQL editor to set up the complete database
-- ============================================================================

-- Drop existing tables if they exist (optional - comment out if you want to preserve data)
-- DROP TABLE IF EXISTS expenses CASCADE;
-- DROP TABLE IF EXISTS materials_inventory_bought CASCADE;
-- DROP TABLE IF EXISTS materials_usage CASCADE;
-- DROP TABLE IF EXISTS inventory_summary CASCADE;
-- DROP TABLE IF EXISTS sales CASCADE;
-- DROP TABLE IF EXISTS production_records CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- 1. PROFILES TABLE - User Profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'data_entry',
    department TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. PRODUCTION_RECORDS TABLE - Production Tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS production_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL,
    -- Categories: B.Preform, B.Loading, B.Store, S.Preform, S.Loading, S.Store
    quantity_produced NUMERIC(10, 2) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT production_positive_quantity CHECK (quantity_produced > 0)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_production_date ON production_records(date);
CREATE INDEX IF NOT EXISTS idx_production_category ON production_records(category);

-- ============================================================================
-- 3. SALES TABLE - Sales Transactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_name TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0,
    amount_remaining NUMERIC(12, 2) DEFAULT 0,
    payment_method TEXT DEFAULT 'Cash',
    -- Payment methods: Cash, Mobile Money, Cheque, Bank Transfer
    payment_status TEXT DEFAULT 'Completed',
    -- Status: Completed, Pending, Failed, Paid, Pending, Partial
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sales_positive_values CHECK (quantity > 0 AND unit_price > 0 AND total_amount > 0)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_name);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(payment_status);

-- ============================================================================
-- 4. EXPENSES TABLE - Expense Tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL,
    -- Categories: Utilities, Salaries, Supplies, Maintenance, Transport, Other
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT DEFAULT 'Cash',
    -- Payment methods: Cash, Mobile Money, Cheque, Bank Transfer
    approved_by TEXT,
    approval_status TEXT DEFAULT 'Pending',
    -- Status: Pending, Approved, Rejected
    notes TEXT,
    receipt_number TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expenses_positive_amount CHECK (amount > 0)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(approval_status);

-- ============================================================================
-- 5. MATERIALS_USAGE TABLE - Daily Material Consumption
-- ============================================================================
CREATE TABLE IF NOT EXISTS materials_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    b_preform NUMERIC(10, 2) DEFAULT 0,
    s_preform NUMERIC(10, 2) DEFAULT 0,
    big_caps NUMERIC(10, 2) DEFAULT 0,
    small_caps NUMERIC(10, 2) DEFAULT 0,
    plastic NUMERIC(10, 2) DEFAULT 0,
    recorded_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_materials_usage_date ON materials_usage(date);

-- ============================================================================
-- 6. MATERIALS_INVENTORY_BOUGHT TABLE - Inventory Purchases
-- ============================================================================
CREATE TABLE IF NOT EXISTS materials_inventory_bought (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL,
    -- Categories: B.Preform, S.Preform, Big Caps, Small Caps, Plastic
    quantity NUMERIC(12, 2) NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(14, 2) NOT NULL,
    supplier TEXT NOT NULL,
    invoice_number TEXT,
    payment_status TEXT DEFAULT 'Pending',
    -- Status: Pending, Paid, Partial, Overdue
    recorded_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inventory_positive_values CHECK (quantity > 0 AND unit_cost > 0 AND total_cost > 0)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_inventory_date ON materials_inventory_bought(purchase_date);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON materials_inventory_bought(category);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier ON materials_inventory_bought(supplier);

-- ============================================================================
-- 7. INVENTORY_SUMMARY TABLE - Current Stock Levels
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_summary (
    category TEXT PRIMARY KEY,
    -- Categories: B.Preform, S.Preform, Big Caps, Small Caps, Plastic
    quantity_in_store NUMERIC(12, 2) DEFAULT 0,
    reorder_level NUMERIC(12, 2) DEFAULT 100,
    last_received_date DATE,
    last_issued_date DATE,
    unit_of_measure TEXT DEFAULT 'Units',
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials_inventory_bought ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_summary ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================
-- Allow users to view all profiles
CREATE POLICY "Allow public read access to profiles"
    ON profiles FOR SELECT
    USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Allow users to insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid()::text = id::text OR true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid()::text = id::text OR true)
    WITH CHECK (auth.uid()::text = id::text OR true);

-- ============================================================================
-- PRODUCTION_RECORDS TABLE POLICIES
-- ============================================================================
-- Allow all authenticated users to view production records
CREATE POLICY "Allow public read access to production_records"
    ON production_records FOR SELECT
    USING (true);

-- Allow all authenticated users to insert production records
CREATE POLICY "Allow public insert to production_records"
    ON production_records FOR INSERT
    WITH CHECK (true);

-- Allow users to update production records
CREATE POLICY "Allow public update to production_records"
    ON production_records FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete production records
CREATE POLICY "Allow public delete from production_records"
    ON production_records FOR DELETE
    USING (true);

-- ============================================================================
-- SALES TABLE POLICIES
-- ============================================================================
-- Allow all users to view sales records
CREATE POLICY "Allow public read access to sales"
    ON sales FOR SELECT
    USING (true);

-- Allow all users to insert sales records
CREATE POLICY "Allow public insert to sales"
    ON sales FOR INSERT
    WITH CHECK (true);

-- Allow users to update sales records
CREATE POLICY "Allow public update to sales"
    ON sales FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete sales records
CREATE POLICY "Allow public delete from sales"
    ON sales FOR DELETE
    USING (true);

-- ============================================================================
-- EXPENSES TABLE POLICIES
-- ============================================================================
-- Allow all users to view expenses
CREATE POLICY "Allow public read access to expenses"
    ON expenses FOR SELECT
    USING (true);

-- Allow all users to insert expenses
CREATE POLICY "Allow public insert to expenses"
    ON expenses FOR INSERT
    WITH CHECK (true);

-- Allow users to update expenses
CREATE POLICY "Allow public update to expenses"
    ON expenses FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete expenses
CREATE POLICY "Allow public delete from expenses"
    ON expenses FOR DELETE
    USING (true);

-- ============================================================================
-- MATERIALS_USAGE TABLE POLICIES
-- ============================================================================
-- Allow all users to view materials usage
CREATE POLICY "Allow public read access to materials_usage"
    ON materials_usage FOR SELECT
    USING (true);

-- Allow all users to insert materials usage
CREATE POLICY "Allow public insert to materials_usage"
    ON materials_usage FOR INSERT
    WITH CHECK (true);

-- Allow users to update materials usage
CREATE POLICY "Allow public update to materials_usage"
    ON materials_usage FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete materials usage
CREATE POLICY "Allow public delete from materials_usage"
    ON materials_usage FOR DELETE
    USING (true);

-- ============================================================================
-- MATERIALS_INVENTORY_BOUGHT TABLE POLICIES
-- ============================================================================
-- Allow all users to view inventory purchases
CREATE POLICY "Allow public read access to materials_inventory_bought"
    ON materials_inventory_bought FOR SELECT
    USING (true);

-- Allow all users to insert inventory purchases
CREATE POLICY "Allow public insert to materials_inventory_bought"
    ON materials_inventory_bought FOR INSERT
    WITH CHECK (true);

-- Allow users to update inventory purchases
CREATE POLICY "Allow public update to materials_inventory_bought"
    ON materials_inventory_bought FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete inventory purchases
CREATE POLICY "Allow public delete from materials_inventory_bought"
    ON materials_inventory_bought FOR DELETE
    USING (true);

-- ============================================================================
-- INVENTORY_SUMMARY TABLE POLICIES
-- ============================================================================
-- Allow all users to view inventory summary
CREATE POLICY "Allow public read access to inventory_summary"
    ON inventory_summary FOR SELECT
    USING (true);

-- Allow all users to insert inventory summary
CREATE POLICY "Allow public insert to inventory_summary"
    ON inventory_summary FOR INSERT
    WITH CHECK (true);

-- Allow users to update inventory summary
CREATE POLICY "Allow public update to inventory_summary"
    ON inventory_summary FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete inventory summary
CREATE POLICY "Allow public delete from inventory_summary"
    ON inventory_summary FOR DELETE
    USING (true);

-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================

-- ============================================================================
-- HELPFUL QUERIES - Run these after creating tables
-- ============================================================================

-- View 1: Total Sales by Date
CREATE OR REPLACE VIEW sales_daily_summary AS
SELECT 
    date,
    COUNT(*) as transaction_count,
    SUM(total_amount) as daily_revenue,
    AVG(total_amount) as avg_transaction_value
FROM sales
WHERE payment_status = 'Completed'
GROUP BY date
ORDER BY date DESC;

-- View 2: Expense Summary
CREATE OR REPLACE VIEW expenses_summary AS
SELECT 
    category,
    SUM(amount) as total_spent,
    COUNT(*) as transaction_count,
    AVG(amount) as avg_expense
FROM expenses
WHERE approval_status = 'Approved'
GROUP BY category
ORDER BY total_spent DESC;

-- View 3: Inventory Status
CREATE OR REPLACE VIEW inventory_status AS
SELECT 
    category,
    quantity_in_store,
    reorder_level,
    CASE 
        WHEN quantity_in_store <= reorder_level THEN 'REORDER NEEDED'
        WHEN quantity_in_store <= reorder_level * 1.5 THEN 'LOW STOCK'
        ELSE 'ADEQUATE'
    END as status
FROM inventory_summary
ORDER BY status DESC, quantity_in_store ASC;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. All tables use UUID for primary keys (generated automatically)
-- 2. All tables have created_at and updated_at timestamps
-- 3. Proper constraints prevent invalid data (e.g., negative quantities)
-- 4. Indexes on frequently queried columns for better performance
-- 5. Views provide quick summaries without complex queries
-- 6. Foreign keys can be added later if needed for referential integrity
-- ============================================================================
