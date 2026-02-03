# 📋 DATABASE SETUP - QUICK REFERENCE

## 5-Minute Setup Checklist

```
⏱️ Total Time: ~5 minutes

1️⃣  Open Supabase → SQL Editor (1 min)
   └─ https://app.supabase.com

2️⃣  Copy & Paste SQL Script (1 min)
   └─ From: CREATE_DATABASE_SCHEMA.sql
   └─ Into: Supabase SQL Editor

3️⃣  Click RUN (⚡) Button (2 min)
   └─ Wait for "Success" message

4️⃣  Verify in Table Editor (1 min)
   └─ Check: 7 tables created ✅

5️⃣  Test with debug.html (1 min)
   └─ Open: file:///...../debug.html
   └─ All 5 steps should be 🟢 green
```

---

## Database Tables at a Glance

### Table: `production_records`
```
┌─ id (UUID, auto)
├─ date (DATE, today by default)
├─ category (TEXT) - B.Preform, B.Loading, B.Store, S.Preform, S.Loading, S.Store
├─ quantity_produced (NUMBER, must be > 0)
├─ quantity (NUMBER, must be > 0)
├─ notes (TEXT, optional)
├─ created_by (TEXT)
└─ created_at, updated_at (auto)
```

### Table: `sales`
```
┌─ id (UUID, auto)
├─ date (DATE, today by default)
├─ customer_name (TEXT)
├─ product (TEXT)
├─ quantity (NUMBER, must be > 0)
├─ unit_price (NUMBER, must be > 0)
├─ total_amount (NUMBER, must be > 0)
├─ payment_method (TEXT) - Cash, Mobile Money, Cheque, Bank Transfer
├─ payment_status (TEXT) - Completed, Pending, Failed
├─ notes (TEXT)
├─ created_by (TEXT)
└─ created_at, updated_at (auto)
```

### Table: `expenses`
```
┌─ id (UUID, auto)
├─ date (DATE, today by default)
├─ category (TEXT) - Utilities, Salaries, Supplies, Maintenance, Transport, Other
├─ description (TEXT)
├─ amount (NUMBER, must be > 0)
├─ payment_method (TEXT) - Cash, Mobile Money, Cheque, Bank Transfer
├─ approval_status (TEXT) - Pending, Approved, Rejected
├─ approved_by (TEXT)
├─ notes (TEXT)
├─ receipt_number (TEXT)
├─ created_by (TEXT)
└─ created_at, updated_at (auto)
```

### Table: `materials_usage`
```
┌─ id (UUID, auto)
├─ date (DATE, today by default)
├─ b_preform (NUMBER, >= 0)
├─ s_preform (NUMBER, >= 0)
├─ big_caps (NUMBER, >= 0)
├─ small_caps (NUMBER, >= 0)
├─ plastic (NUMBER, >= 0)
├─ recorded_by (TEXT)
├─ notes (TEXT)
└─ created_at, updated_at (auto)
```

### Table: `materials_inventory_bought`
```
┌─ id (UUID, auto)
├─ purchase_date (DATE, today by default)
├─ category (TEXT) - B.Preform, S.Preform, Big Caps, Small Caps, Plastic
├─ quantity (NUMBER, must be > 0)
├─ unit_cost (NUMBER, must be > 0)
├─ total_cost (NUMBER, must be > 0)
├─ supplier (TEXT)
├─ invoice_number (TEXT)
├─ payment_status (TEXT) - Pending, Paid, Partial, Overdue
├─ recorded_by (TEXT)
├─ notes (TEXT)
└─ created_at, updated_at (auto)
```

### Table: `inventory_summary`
```
┌─ category (TEXT, primary key) - B.Preform, S.Preform, Big Caps, Small Caps, Plastic
├─ quantity_in_store (NUMBER)
├─ reorder_level (NUMBER)
├─ last_received_date (DATE)
├─ last_issued_date (DATE)
├─ unit_of_measure (TEXT)
├─ notes (TEXT)
└─ updated_at (auto)
```

### Table: `profiles`
```
┌─ id (UUID, auto)
├─ email (TEXT, unique)
├─ full_name (TEXT)
├─ role (TEXT) - data_entry, manager, admin
├─ department (TEXT)
├─ phone (TEXT)
├─ is_active (BOOLEAN, true by default)
└─ created_at, updated_at (auto)
```

---

## Common SQL Queries (Reference)

### Get Today's Sales
```sql
SELECT * FROM sales WHERE date = CURRENT_DATE;
```

### Total Revenue This Month
```sql
SELECT SUM(total_amount) FROM sales 
WHERE date >= DATE_TRUNC('month', CURRENT_DATE);
```

### Low Stock Items
```sql
SELECT * FROM inventory_summary 
WHERE quantity_in_store <= reorder_level;
```

### Pending Expenses
```sql
SELECT * FROM expenses 
WHERE approval_status = 'Pending';
```

### Daily Production Summary
```sql
SELECT date, category, SUM(quantity_produced) as total
FROM production_records
WHERE date = CURRENT_DATE
GROUP BY date, category;
```

---

## JavaScript Usage (Your System)

### Add Production Record
```javascript
await window.db.addProduction({
    date: '2026-02-03',
    category: 'B.Preform',
    quantity: 100,
    quantity_produced: 100,
    notes: 'Morning batch'
});
```

### Get All Sales
```javascript
const sales = await window.db.getSales();
console.log(sales); // Array of sales records
```

### Update Expense
```javascript
await window.db.updateExpense(expenseId, {
    approval_status: 'Approved'
});
```

### Delete Production Record
```javascript
await window.db.deleteProduction(productionId);
```

---

## Useful Supabase Links

| Resource | Link |
|----------|------|
| SQL Editor | https://app.supabase.com → SQL Editor |
| Table Editor | https://app.supabase.com → Table Editor |
| Documentation | https://supabase.com/docs |
| JavaScript Guide | https://supabase.com/docs/reference/javascript |

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Table does not exist" | Run CREATE_DATABASE_SCHEMA.sql again |
| "Permission denied" | Check RLS policies in Supabase |
| "Duplicate key" | Ensure column is unique, don't insert twice |
| "Failed to fetch" | Check Supabase URL format (ends in .supabase.co) |
| Data not saving | Check console (F12) for JavaScript errors |

---

## File Locations

```
starland-financial-system/
├── CREATE_DATABASE_SCHEMA.sql      ← Run this in Supabase SQL Editor
├── DATABASE_SETUP_GUIDE.md         ← Full setup instructions
├── DATABASE_QUICK_REFERENCE.md     ← This file
├── js/
│   ├── supabase-config.js          ← Your credentials (already set)
│   └── supabase-db.js              ← Database helper (already set)
├── data-entry/
│   ├── index.html                  ← Start here after setup
│   ├── dashboard.html
│   ├── production.html
│   ├── sales.html
│   ├── expenses.html
│   └── materials.html
└── debug.html                       ← Test connection here
```

---

## 🎯 Next: What to Do After Setup

1. **Test Connection**
   - Open `debug.html` in browser
   - Click "Test Connection" button

2. **Add Test Data**
   - Go to `data-entry/production.html`
   - Add a production record
   - Check Supabase Table Editor - it should appear!

3. **Explore All Modules**
   - Production, Sales, Expenses, Materials

4. **Check Reports** (coming soon)
   - Go to `management/reports.html`

---

✅ **You're ready to go!**
