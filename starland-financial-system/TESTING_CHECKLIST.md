# Starland ERP Testing Checklist

## 🚀 Quick Start Testing

### Prerequisites
- Supabase project is set up with `NEW_SETUP.sql` executed
- `js/config.js` has correct Supabase URL and anon key
- Access to the system files (local or deployed)

---

## 📋 Core Functionality Tests

### 1. Portal Access & Navigation
- [ ] Root `index.html` loads and shows "Data Entry" and "Management" buttons
- [ ] Data Entry button navigates to `data-entry/index.html`
- [ ] Management button navigates to `management/index.html`

### 2. User Registration
#### Management Portal Registration
- [ ] Navigate to `management/register.html`
- [ ] Register with username (3+ chars) + password
- [ ] Registration succeeds and redirects to management login
- [ ] User gets 'Admin' role in `public.users` table

#### Data Entry Portal Registration  
- [ ] Navigate to `register.html` (or from data-entry login link)
- [ ] Register with username (3+ chars) + password
- [ ] Registration succeeds and redirects to data-entry login
- [ ] User gets 'User' role in `public.users` table

### 3. Login & Role-Based Access
#### Management Login (Admin/Manager)
- [ ] Login at `management/index.html` with Admin account
- [ ] Redirects to `management/dashboard.html`
- [ ] Dashboard shows "Management Overview" header
- [ ] Sidebar shows: Dashboard, Reports, Settings
- [ ] Can access all three management pages

#### Data Entry Login (User)
- [ ] Login at `data-entry/index.html` with User account
- [ ] Redirects to `pages/dashboard.html`
- [ ] Dashboard shows "Dashboard" header
- [ ] Sidebar shows: Dashboard, Production, Sales, Expenses, Materials
- [ ] Can access all data entry pages

#### Cross-Portal Access Testing
- [ ] Try accessing `management/dashboard.html` while logged in as Data Entry user
- [ ] Should redirect to data-entry dashboard (access denied)
- [ ] Try accessing `pages/dashboard.html` while logged in as Management user
- [ ] Should work (management can access data entry pages)

---

## 📊 Data Entry Module Tests

### 4. Production Module
- [ ] Navigate to Production page
- [ ] Form accepts: Date, Category, Quantity
- [ ] Submit adds new record and shows in today's list
- [ ] "Today's Total" updates correctly
- [ ] Records show in chronological order

### 5. Sales Module
- [ ] Navigate to Sales page
- [ ] Form accepts: Date, Product Type, Quantity, Unit Price, Customer
- [ ] Submit calculates total amount correctly
- [ ] Shows debt status (Paid/Unpaid)
- [ ] "Today's Sales" and "Today's Revenue" update
- [ ] Recent entries show customer names

### 6. Expenses Module
- [ ] Navigate to Expenses page
- [ ] Form accepts: Date, Expense Type, Amount, Description
- [ ] Submit adds new expense
- [ ] "Today's Expenses" updates correctly
- [ ] Recent entries show expense types

### 7. Materials Module
#### Daily Usage
- [ ] Form accepts: Date, Material Type, Quantity Used
- [ ] Submit adds usage record
- [ ] Usage shows in recent entries

#### Inventory Bought
- [ ] Form accepts: Date, B-preform, S-preform, Big Caps, Small Caps, Plastic
- [ ] Submit adds inventory record
- [ ] "Inventory Summary" calculates variance correctly
- [ ] Variance = Bought - Used for each material

---

## 👑 Management Portal Tests

### 8. Management Dashboard
- [ ] Login as Admin/Manager and view dashboard
- [ ] Top metrics show "All Time" data (not just current month)
- [ ] Total Revenue reflects all sales ever entered
- [ ] Total Expenses reflects all expenses ever entered
- [ ] Net Income = Revenue - Expenses

### 9. Dashboard Detail Sections
#### Production Summary
- [ ] Shows total records and quantities
- [ ] Lists recent 5 production entries
- [ ] Data includes all users' entries (not just own)

#### Sales Summary
- [ ] Shows total sales count and revenue
- [ ] Lists recent 5 sales with customer names
- [ ] Data includes all users' entries

#### Expenses Summary
- [ ] Shows total expense count and amount
- [ ] Lists recent 5 expenses with descriptions
- [ ] Data includes all users' entries

#### Materials Summary
- [ ] Shows usage records and inventory purchases
- [ ] Lists recent usage and recent purchases
- [ ] Data includes all users' entries

### 10. Reports Page
- [ ] Navigate to Reports page
- [ ] Shows last 30 days metrics
- [ ] Debtors list displays customers with outstanding balances
- [ ] Data aggregates from all users

### 11. Settings Page
- [ ] Navigate to Settings page
- [ ] Shows signed-in user email
- [ ] Logout functionality works

---

## 🔐 Security & Data Access Tests

### 12. Row Level Security (RLS)
#### Data Entry User (User role)
- [ ] Can only see their own records in each module
- [ ] Cannot see records from other users
- [ ] Can edit/delete only their own records
- [ ] Cannot access management pages

#### Management User (Admin/Manager role)
- [ ] Can see all records from all users
- [ ] Can edit/delete any records
- [ ] Can access both management and data entry pages
- [ ] Dashboard aggregates all data

### 13. Authentication Edge Cases
- [ ] Wrong password shows error message
- [ ] Non-existent username shows error message
- [ ] Empty form validation works
- [ ] Logout redirects to correct portal chooser

---

## 🐛 Common Issues to Check

### 14. Data Consistency
- [ ] Dashboard metrics match individual module totals
- [ ] Calculations (sales totals, net income) are correct
- [ ] Date filters work properly (current month vs all time)
- [ ] Currency formatting shows KES with 2 decimal places

### 15. UI/UX Issues
- [ ] All buttons and forms are responsive
- [ ] Loading states show during data fetch
- [ ] Error messages are user-friendly
- [ ] Sidebar navigation highlights active page

### 16. Browser Compatibility
- [ ] Works in Chrome/Firefox/Safari
- [ ] Mobile responsive (if applicable)
- [ ] Console shows no JavaScript errors

---

## ✅ Success Criteria

### Basic Functionality Pass
- All users can register and login successfully
- Data entry users can input data in all modules
- Management users can view aggregated dashboard
- Role-based access control works correctly

### Advanced Functionality Pass  
- RLS policies enforce data visibility correctly
- Dashboard calculations are accurate
- Cross-portal access restrictions work
- No console errors or broken functionality

---

## 📞 Troubleshooting Guide

### Registration Issues
- **"Email rate limit exceeded"**: Use manual user creation in Supabase dashboard
- **"Invalid email"**: Ensure fake emails use `@example.com` domain

### Login Issues
- **Wrong redirect**: Check `getCurrentRole()` function in `js/auth.js`
- **Access denied**: Verify RLS policies in Supabase

### Dashboard Issues
- **Showing KES 0.00**: Check Supabase connection and table names
- **Wrong data range**: Verify date filtering logic in `js/dashboard.js`

### Data Issues
- **Can't see data**: Check RLS policies and user roles
- **Can't edit data**: Verify user permissions and record ownership

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Environment: [ ] Local [ ] Staging [ ] Production

Core Functionality: [ ] Pass [ ] Fail
Data Entry: [ ] Pass [ ] Fail  
Management Portal: [ ] Pass [ ] Fail
Security: [ ] Pass [ ] Fail

Issues Found:
1. _________________________
2. _________________________
3. _________________________

Notes: _________________________
```
