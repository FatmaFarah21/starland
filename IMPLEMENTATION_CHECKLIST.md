# Supabase Integration Checklist

## ✅ Setup Complete - Your Next Steps

### Phase 1: Configuration (Do This First)
- [ ] Go to https://app.supabase.com and log in
- [ ] Find your Starland Water project
- [ ] Go to Settings → API
- [ ] Copy your Project URL (example: https://xxxxx.supabase.co)
- [ ] Copy your Anon/Public Key
- [ ] Edit `js/supabase-config.js`
- [ ] Replace `https://your-project-id.supabase.co` with your Project URL
- [ ] Replace `your-anon-key-here` with your Anon Key
- [ ] Save the file

### Phase 2: Database Setup (Create Tables)
Go to your Supabase project and create these tables:

**Table: production**
- [ ] id (uuid, primary key)
- [ ] date (date)
- [ ] category (text)
- [ ] quantity (numeric)
- [ ] notes (text)
- [ ] created_at (timestamp with timezone)

**Table: sales**
- [ ] id (uuid, primary key)
- [ ] date (date)
- [ ] customer_name (text)
- [ ] product (text)
- [ ] quantity (numeric)
- [ ] unit_price (numeric)
- [ ] total_amount (numeric)
- [ ] payment_method (text)
- [ ] notes (text)
- [ ] created_at (timestamp with timezone)

**Table: expenses**
- [ ] id (uuid, primary key)
- [ ] date (date)
- [ ] category (text)
- [ ] description (text)
- [ ] amount (numeric)
- [ ] notes (text)
- [ ] created_at (timestamp with timezone)

**Table: materials_daily**
- [ ] id (uuid, primary key)
- [ ] date (date)
- [ ] b_preform (numeric)
- [ ] s_preform (numeric)
- [ ] big_caps (numeric)
- [ ] small_caps (numeric)
- [ ] plastic (numeric)
- [ ] created_at (timestamp with timezone)

**Table: inventory_purchases**
- [ ] id (uuid, primary key)
- [ ] purchase_date (date)
- [ ] category (text)
- [ ] quantity (numeric)
- [ ] unit_cost (numeric)
- [ ] total_cost (numeric)
- [ ] supplier (text)
- [ ] created_at (timestamp with timezone)

**Table: inventory_summary**
- [ ] category (text, primary key)
- [ ] quantity_in_store (numeric)
- [ ] reorder_level (numeric)
- [ ] last_updated (timestamp with timezone)

### Phase 3: Test Connection
- [ ] Open any page in your browser (e.g., data-entry/production.html)
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Type: `window.db.getProduction().then(d => console.log(d))`
- [ ] Press Enter
- [ ] You should see an empty array or error if no data exists yet
- [ ] If you see an error, check your credentials in supabase-config.js

### Phase 4: Update JavaScript Files
For each JavaScript file, follow the guide in `SUPABASE_INTEGRATION.md`:

- [ ] Update `js/production.js`
  - [ ] Update handleSubmitProduction()
  - [ ] Update editProduction()
  - [ ] Update deleteProduction()
  - [ ] Add loadProductions()

- [ ] Update `js/sales.js`
  - [ ] Update handleAddSales()
  - [ ] Add loadSales()
  - [ ] Add editSales()
  - [ ] Add deleteSales()

- [ ] Update `js/expenses.js`
  - [ ] Update handleAddExpense()
  - [ ] Add loadExpenses()
  - [ ] Add editExpense()
  - [ ] Add deleteExpense()

- [ ] Update `js/materials.js`
  - [ ] Update handleSubmitDailyMaterial()
  - [ ] Update handleSubmitInventoryPurchase()
  - [ ] Add loadDailyMaterials()
  - [ ] Add loadPurchases()

- [ ] Update `js/dashboard.js`
  - [ ] Add loadDashboardStats()

### Phase 5: Test Each Module
- [ ] Go to data-entry/production.html
- [ ] Add a test production record
- [ ] Verify it appears in the table
- [ ] Verify it appears in Supabase dashboard

- [ ] Go to data-entry/sales.html
- [ ] Add a test sales record
- [ ] Verify it appears in the table

- [ ] Go to data-entry/expenses.html
- [ ] Add a test expense record
- [ ] Verify it appears in the table

- [ ] Go to data-entry/materials.html
- [ ] Add test material records
- [ ] Verify they appear in tables

- [ ] Go to data-entry/dashboard.html
- [ ] Verify stats load from database

### Phase 6: Management Pages
- [ ] Verify management pages also load data correctly
- [ ] Test edit/delete functions
- [ ] Test reporting functions

### Phase 7: Deployment
- [ ] Review SUPABASE_SETUP.md for security notes
- [ ] Set up Row Level Security (RLS) in Supabase (optional but recommended)
- [ ] Create environment-specific configurations if needed
- [ ] Test on production-like environment

## Files Created for Reference

✅ **New Config Files:**
- `js/supabase-config.js` - Configuration (needs your credentials)
- `js/supabase-db.js` - All database methods

✅ **Documentation:**
- `SUPABASE_README.md` - Quick start guide
- `SUPABASE_SETUP.md` - Complete setup and schema
- `SUPABASE_INTEGRATION.md` - Code integration examples
- `SUPABASE_COMPLETE.md` - Summary of changes

✅ **Updated HTML Pages (16 total):**
- All data-entry pages include Supabase library
- All management pages include Supabase library

## Troubleshooting

### Issue: "supabaseClient is not defined"
**Solution:** 
- Check that supabase-config.js is being loaded
- Verify path is correct: `../../js/` for data-entry, `../js/` for management

### Issue: "Cannot read property 'from' of undefined"
**Solution:**
- Check your URL and ANON_KEY in supabase-config.js
- Make sure Project URL ends with `.supabase.co`

### Issue: No data appearing in Supabase
**Solution:**
- Check browser console for errors (F12 → Console)
- Verify table names match exactly (case-sensitive)
- Check that ANON_KEY has proper permissions

### Issue: CORS errors
**Solution:**
- This is normal in development
- Supabase handles CORS by default
- No additional configuration needed

## Available Global Methods

Once configured, these are available everywhere:

```javascript
// Test in console:
window.db.getProduction()
window.db.getSales()
window.db.getExpenses()
window.db.getMaterialsDaily()
window.db.getInventoryPurchases()
window.db.getDashboardStats()
```

## Quick Reference

**Add data:**
```javascript
await window.db.addProduction({date: '2024-02-02', category: 'B.Production', quantity: 100})
```

**Get data:**
```javascript
const records = await window.db.getProduction()
```

**Update data:**
```javascript
await window.db.updateProduction(id, {quantity: 150})
```

**Delete data:**
```javascript
await window.db.deleteProduction(id)
```

## Success Indicators

You'll know everything is working when:
1. ✅ Configuration file has no errors
2. ✅ All pages load without console errors
3. ✅ Database tables exist in Supabase
4. ✅ Adding data works and appears in Supabase
5. ✅ Loading data shows correct records
6. ✅ Edit/Delete functions work
7. ✅ Dashboard shows correct stats

## Getting Help

1. Check the appropriate documentation file:
   - Setup questions → `SUPABASE_SETUP.md`
   - Code questions → `SUPABASE_INTEGRATION.md`
   - General questions → `SUPABASE_README.md`

2. Check browser console (F12) for error messages

3. Verify Supabase project status at supabase.com

Good luck! 🚀
