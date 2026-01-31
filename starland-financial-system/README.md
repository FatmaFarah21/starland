# Starland Financial System

A minimal Supabase-powered financial dashboard for Starland with username-based authentication.

## Quick Setup (New Project)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) → New Project
   - Choose a database password and region
   - Wait for project to be ready

2. **Configure Authentication**
   - Go to Authentication → Settings
   - Disable "Enable email confirmations"
   - Copy Project URL and anon key

3. **Update Configuration**
   - Open `js/config.js`
   - Replace `YOUR_NEW_SUPABASE_URL` with your Project URL
   - Replace `YOUR_NEW_SUPABASE_ANON_KEY` with your anon key

4. **Setup Database**
   - Open SQL Editor in Supabase
   - Copy and run the entire contents of `NEW_SETUP.sql`

5. **Create First Admin User**
   - Open `management/register.html` in your browser
   - Register an account (automatically gets Admin role)
   - Login at `management/index.html`

## Features

- **Username + Password Login** (no email verification)
- **Role-Based Access**: Admin, Manager, User
- **Separate Portals**: Management and Data Entry
- **Full CRUD**: Production, Sales, Expenses, Materials
- **Reports & Analytics**
- **Row Level Security** for data protection

## File Structure

- `index.html` - Portal chooser
- `management/` - Management portal (Admin/Manager access)
- `data-entry/` - Data Entry portal (User access)
- `pages/` - Shared data entry pages
- `js/` - JavaScript modules
- `css/` - Stylesheets

## Authentication

- Registration creates users instantly (no email verification)
- Management registration creates Admin accounts
- Public registration creates Data Entry accounts
- Username must be unique and 3+ characters
