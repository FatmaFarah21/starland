# Supabase Configuration - Quick Start

## What's Been Set Up

✅ **Supabase configuration files created:**
- `js/supabase-config.js` - Configuration template (needs your credentials)
- `js/supabase-db.js` - Database helper functions for all CRUD operations

✅ **All HTML pages updated:**
- All 6 data-entry pages now include Supabase scripts
- All 10 management pages now include Supabase scripts
- Supabase library automatically loaded from CDN

✅ **Documentation created:**
- `SUPABASE_SETUP.md` - Complete setup and database schema
- `SUPABASE_INTEGRATION.md` - How to integrate with your existing functions

## Quick Start (3 Steps)

### Step 1: Get Your Credentials
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your Starland Water project
3. Go to **Settings → API**
4. Copy your **Project URL** and **Anon Key**

### Step 2: Update Configuration
Edit `js/supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    URL: 'https://your-project-id.supabase.co',  // Paste your URL here
    ANON_KEY: 'your-anon-key-here'                 // Paste your key here
};
```

### Step 3: Ensure Database Tables Exist
Make sure these tables exist in your Supabase database:
- `production`
- `sales`
- `expenses`
- `materials_daily`
- `inventory_purchases`
- `inventory_summary`

(See `SUPABASE_SETUP.md` for complete table schemas)

## Usage Examples

### Add Data
```javascript
await window.db.addProduction({
    date: '2024-02-02',
    category: 'B.Production',
    quantity: 100,
    notes: 'Morning batch'
});
```

### Get Data
```javascript
const productions = await window.db.getProduction();
console.log(productions);
```

### Update Data
```javascript
await window.db.updateProduction(productionId, {
    quantity: 150
});
```

### Delete Data
```javascript
await window.db.deleteProduction(productionId);
```

## Files Structure

```
starland-financial-system/
├── js/
│   ├── supabase-config.js       ← Update with your credentials
│   ├── supabase-db.js           ← Database helper functions
│   ├── production.js            ← Update with Supabase calls
│   ├── sales.js                 ← Update with Supabase calls
│   ├── expenses.js              ← Update with Supabase calls
│   ├── materials.js             ← Update with Supabase calls
│   └── ...
├── data-entry/                  ← All include Supabase scripts ✅
│   ├── production.html          ✅
│   ├── sales.html               ✅
│   ├── expenses.html            ✅
│   ├── materials.html           ✅
│   ├── dashboard.html           ✅
│   └── ...
├── management/                  ← All include Supabase scripts ✅
│   ├── production.html          ✅
│   ├── sales.html               ✅
│   ├── expenses.html            ✅
│   └── ...
├── SUPABASE_SETUP.md            ← Detailed setup guide
└── SUPABASE_INTEGRATION.md      ← Integration guide with code examples
```

## Available Methods

**Global object: `window.db`**

```javascript
// Production
db.addProduction(data)
db.getProduction()
db.updateProduction(id, data)
db.deleteProduction(id)

// Sales
db.addSales(data)
db.getSales()
db.updateSales(id, data)
db.deleteSales(id)

// Expenses
db.addExpense(data)
db.getExpenses()
db.updateExpense(id, data)
db.deleteExpense(id)

// Materials
db.addMaterialDaily(data)
db.getMaterialsDaily()
db.addInventoryPurchase(data)
db.getInventoryPurchases()
db.getInventorySummary()
db.updateInventorySummary(category, data)

// Dashboard & Reports
db.getDashboardStats()
db.getProductionReport(startDate, endDate)
db.getSalesReport(startDate, endDate)
db.getExpensesReport(startDate, endDate)
```

## Next Steps

1. ✅ Update `supabase-config.js` with your credentials
2. Update JavaScript files to use `window.db` methods (see `SUPABASE_INTEGRATION.md`)
3. Test each page in the browser
4. Check Supabase dashboard to verify data is being saved

## Troubleshooting

**Error: "supabaseClient is not defined"**
- Check that `supabase-config.js` is loaded before other scripts
- Verify the Supabase library is loaded from CDN

**No data appearing**
- Check browser console for errors
- Verify database table names match exactly
- Ensure your ANON_KEY has proper read/write permissions

**CORS errors**
- This is normal in development - Supabase handles this by default
- Check Supabase dashboard if issues persist

## Documentation Files

- **SUPABASE_SETUP.md** - Complete setup guide with database schema
- **SUPABASE_INTEGRATION.md** - Code examples for integrating with existing functions
- **README.md** (this file) - Quick start guide

For questions or more details, see the appropriate documentation file!
