-- Database Schema for Starland Water Company System
-- Creates all necessary tables for the application

-- Table for sales transactions
CREATE TABLE IF NOT EXISTS sales_transactions (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    product_type VARCHAR(50) CHECK (product_type IN ('drum', 'jerrycan', 'small_bottle')),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'M-Pesa', 'Bank Transfer', 'Credit')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table for expense transactions
CREATE TABLE IF NOT EXISTS expense_transactions (
    id SERIAL PRIMARY KEY,
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('diesel', 'salary', 'maintenance', 'utilities', 'rent', 'other')),
    vendor VARCHAR(255),
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'M-Pesa', 'Bank Transfer', 'Credit')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table for diesel transactions
CREATE TABLE IF NOT EXISTS diesel_transactions (
    id SERIAL PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    liters DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(12, 2) NOT NULL,
    vehicle VARCHAR(255),
    driver VARCHAR(255),
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'M-Pesa', 'Bank Transfer', 'Credit')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table for repair transactions
CREATE TABLE IF NOT EXISTS repair_transactions (
    id SERIAL PRIMARY KEY,
    repair_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    equipment VARCHAR(255) NOT NULL,
    repair_type VARCHAR(100),
    problem_description TEXT,
    cost DECIMAL(12, 2) NOT NULL,
    repair_shop VARCHAR(255),
    technician VARCHAR(255),
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'M-Pesa', 'Bank Transfer', 'Credit')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Table for damage records
CREATE TABLE IF NOT EXISTS damage_transactions (
    id SERIAL PRIMARY KEY,
    damage_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    item_type VARCHAR(100),
    item_name VARCHAR(255) NOT NULL,
    damage_cause VARCHAR(255),
    estimated_value DECIMAL(12, 2) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    responsible_party VARCHAR(255),
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Insert sample data for testing (optional)
-- Uncomment the following lines to insert sample data:
/*
INSERT INTO sales_transactions (receipt_number, date, customer_name, contact_info, product_type, quantity, unit_price, total_amount, payment_method, notes, created_by) VALUES
('SAL-001', '2023-06-15', 'John Doe', 'john@example.com', 'drum', 10, 300.00, 3000.00, 'Cash', 'Regular customer', 'admin@company.com'),
('SAL-002', '2023-06-16', 'Jane Smith', 'jane@example.com', 'jerrycan', 20, 60.00, 1200.00, 'M-Pesa', 'New customer', 'admin@company.com');

INSERT INTO expense_transactions (expense_number, date, category, vendor, description, amount, payment_method, notes, created_by) VALUES
('EXP-001', '2023-06-15', 'diesel', 'Petrol Station', 'Fuel for delivery truck', 5000.00, 'Cash', 'Monthly fuel', 'admin@company.com'),
('EXP-002', '2023-06-16', 'salary', '', 'Monthly staff salary', 45000.00, 'Bank Transfer', 'June payroll', 'admin@company.com');
*/