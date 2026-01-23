# Troubleshooting Guide: Starland Water Company System

## Common Issues and Solutions

### 1. Admin Dashboard Not Showing Data from Data Entry

#### Issue Description
The admin dashboard is not displaying transactions that have been entered in the data entry modules.

#### Root Causes and Solutions

**A. Database Tables Not Created**
- **Problem**: Supabase tables don't exist in your project
- **Solution**: Run the SQL from `db_init.sql` in your Supabase SQL editor

**B. Supabase Configuration Missing**
- **Problem**: Supabase URL and API key not configured
- **Solution**: Update `js/supabase.js` with your project credentials:
  ```javascript
  const SUPABASE_URL = 'your_supabase_project_url';
  const SUPABASE_ANON_KEY = 'your_supabase_anon_key';
  ```

**C. Tables Missing Row Level Security (RLS) Configuration**
- **Problem**: Database queries fail due to RLS policies
- **Solution**: Either disable RLS for development or set up proper policies

#### Verification Steps

1. **Check Browser Console**: Open developer tools (F12) and look for any JavaScript errors
2. **Run Diagnostics**: Execute `runDiagnostics()` in the browser console
3. **Test Connection**: Click the "Test Connection" button on the login page
4. **Check Database**: Verify your Supabase project has the required tables

### 2. Database Connection Issues

#### Symptoms
- Error messages about database connection failures
- Data not saving to database
- Fallback to localStorage occurring

#### Solutions
1. **Verify Supabase Credentials**: Ensure correct URL and API key in `js/supabase.js`
2. **Check Network**: Ensure internet connectivity
3. **Verify Table Names**: Confirm table names match what's in the code
4. **Check RLS Policies**: Ensure Row Level Security policies allow access

### 3. Authentication Problems

#### Symptoms
- Cannot log in
- Authentication errors
- Session issues

#### Solutions
1. **Create Users**: Use Supabase dashboard to create user accounts
2. **Check User Metadata**: Ensure users have proper roles in their metadata
3. **Verify Email Confirmation**: For development, you may need to disable email confirmation

## Quick Fixes

### Immediate Actions to Try

1. **Refresh the Page**: Sometimes a simple refresh resolves temporary issues
2. **Clear Browser Cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh
3. **Check Browser Console**: Look for specific error messages
4. **Run Diagnostics**: Execute `runDiagnostics()` in the browser console

### Database Initialization

If tables don't exist, run this SQL in your Supabase SQL editor:

```sql
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
    created_by VARCHAR(255),
    created_by_name VARCHAR(255)
);

-- Table for expense transactions
CREATE TABLE IF NOT EXISTS expense_transactions (
    id SERIAL PRIMARY KEY,
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'M-Pesa', 'Bank Transfer', 'Credit')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    created_by_name VARCHAR(255)
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
    vehicle_number VARCHAR(50) NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    odometer_start INTEGER,
    odometer_end INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    created_by_name VARCHAR(255)
);

-- Table for repair transactions
CREATE TABLE IF NOT EXISTS repair_transactions (
    id SERIAL PRIMARY KEY,
    repair_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    repair_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    created_by_name VARCHAR(255)
);

-- Table for damage transactions
CREATE TABLE IF NOT EXISTS damage_transactions (
    id SERIAL PRIMARY KEY,
    damage_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    asset_id VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    estimated_value DECIMAL(12, 2),
    repair_required BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    created_by_name VARCHAR(255)
);
```

## Diagnostic Commands

### Available Console Commands

Once the page loads, you can run these commands in the browser console:

- `runDiagnostics()` - Comprehensive system check
- `window.supabaseAuth.testConnection()` - Test Supabase connection
- `updateRecentTransactions()` - Manually refresh admin transactions
- `console.log(window.supabaseClient)` - Check if Supabase client is loaded

## Support Steps

If issues persist after trying the above:

1. **Check Console Errors**: Note any error messages in the browser console
2. **Verify Configuration**: Double-check your Supabase URL and API key
3. **Test with Sample Data**: Enter some data in data entry modules and check if it appears
4. **Contact Support**: Provide the specific error messages and steps you've taken

## Success Indicators

When the system is working properly:

- Data entered in any entry module appears in management dashboards
- Admin dashboard shows recent transactions with user attribution
- No JavaScript errors in the browser console
- Database connection test passes
- All modules load without issues