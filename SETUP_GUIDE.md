# Starland Water Company Management System - Setup Guide

## Overview
This is a comprehensive water company management system that handles sales, expenses, diesel purchases, repairs, and damages with reporting capabilities. The system uses Supabase for backend services and authentication.

## Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Supabase account (for production deployment)

## Installation Steps

### 1. Clone or Download the System
Download the entire system folder to your local machine or web server.

### 2. Supabase Configuration (Required for Full Functionality)

#### Option A: Use Provided Demo Configuration (Limited)
The system comes pre-configured with a demo Supabase project. This works for testing but has limitations:
- Shared database with other users
- Potential data conflicts
- Rate limits may apply

#### Option B: Set Up Your Own Supabase Project (Recommended)
1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Note down your Project URL and Anonymous/Public Key
4. Update `/js/supabase.js` with your credentials:
   ```javascript
   const SUPABASE_URL = 'your_project_url';
   const SUPABASE_ANON_KEY = 'your_anon_key';
   ```

### 3. Database Setup
Run the SQL commands in `db_init.sql` in your Supabase SQL editor:
1. Go to your Supabase dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `db_init.sql`
4. Execute the script to create all required tables

### 4. Authentication Setup
1. In your Supabase dashboard, go to "Authentication" > "Settings"
2. Configure the following:
   - Enable Email Signups
   - Set Site URL to your domain (e.g., `https://yourdomain.com`)
   - Add redirect URLs as needed
   - For development, you may disable "Email confirmations"

### 5. User Roles Setup
The system supports three user roles:
- **Admin**: Full access to all features
- **Management**: Access to dashboards and reports
- **Entry**: Access to data entry forms only

Users can be assigned roles in the Supabase dashboard under "Authentication" > "Users".

## System Features

### Authentication
- Secure login/logout functionality
- Role-based access control
- Session management

### Data Entry
- Sales entry with receipt numbers
- Expense tracking
- Diesel purchase records
- Repair logs
- Damage reports

### Management Interface
- Real-time dashboard with KPIs
- Sales, expense, diesel, repair, and damage management
- Comprehensive reporting with CSV exports
- Data visualization

### Reporting
- Sales reports
- Expense analysis
- Cash flow reports
- Inventory tracking
- Custom date range reports
- CSV export functionality

## Security Best Practices

### For Production Deployment:
1. **Never expose your Supabase keys in public repositories**
2. **Set up Row Level Security (RLS)** in Supabase for data protection
3. **Configure proper authentication providers** (Google, GitHub, etc.)
4. **Set up email templates** for password resets and notifications
5. **Implement rate limiting** to prevent abuse

### Recommended RLS Policies:
```sql
-- Allow users to only see their own data based on role
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for admins" ON sales_transactions
  FOR ALL USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));
```

## Customization Options

### Branding
- Update company name in all HTML files
- Modify CSS in `/css/main.css` for custom styling
- Add your logo to the sidebar

### Business Logic
- Adjust product types in sales forms
- Modify expense categories
- Customize report formats
- Change currency from KES to your local currency

## Troubleshooting

### Common Issues:
1. **"Error generating report"**: Usually occurs when database tables don't exist. Run the SQL initialization script.
2. **Login fails**: Check Supabase authentication settings and confirm user emails if email confirmation is enabled.
3. **Data not syncing**: Verify Supabase connection and check browser console for errors.

### Checking System Status:
1. Open browser developer tools (F12)
2. Check the Console tab for any error messages
3. Check the Network tab to ensure API calls are successful

## Support & Maintenance

### Regular Maintenance:
- Monitor database size and performance
- Review user access and roles regularly
- Backup critical data
- Update system dependencies periodically

### Getting Help:
- Check browser console for error details
- Verify Supabase project settings
- Contact support with specific error messages and screenshots

## Going Live

### Pre-deployment Checklist:
- [ ] Set up production Supabase project
- [ ] Update API keys in production environment
- [ ] Test all functionality with new configuration
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Test mobile responsiveness
- [ ] Verify all reports and exports work

### Performance Optimization:
- Enable Supabase caching where appropriate
- Optimize database queries for large datasets
- Implement pagination for large data tables
- Set up monitoring and alerts

---

For technical support, please contact your system administrator or the development team with specific error messages and steps to reproduce any issues.