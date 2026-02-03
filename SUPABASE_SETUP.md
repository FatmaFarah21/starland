# Supabase Integration Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your Starland Water project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public key** (the public key for frontend use)

## Step 2: Add Supabase Library to Your HTML Files

Add this script tag to the `<head>` section of all HTML files (before other script tags):

```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Supabase Configuration -->
<script src="../../js/supabase-config.js"></script>

<!-- Supabase Database Helper -->
<script src="../../js/supabase-db.js"></script>
```

**Important:** Adjust the path (`../../js/`) based on where your HTML file is located.

For files in `data-entry/` folder: Use `../../js/`
For files in `management/` folder: Use `../js/`

## Step 3: Update supabase-config.js

Edit `/js/supabase-config.js` and replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    URL: 'https://your-project-id.supabase.co',  // Replace with your Project URL
    ANON_KEY: 'your-anon-key-here'                 // Replace with your Anon Key
};
```

## Step 4: Database Tables Structure

Your Supabase database should have these tables:

### production
```sql
- id (uuid, primary key)
- date (date)
- category (text) - B.Production, B.Loading, B.Store, S.Production, S.Loading, S.Store
- quantity (numeric)
- notes (text, optional)
- created_at (timestamp)
- created_by (text, optional)
```

### sales
```sql
- id (uuid, primary key)
- date (date)
- customer_name (text)
- product (text)
- quantity (numeric)
- unit_price (numeric)
- total_amount (numeric)
- payment_method (text)
- notes (text, optional)
- created_at (timestamp)
- created_by (text, optional)
```

### expenses
```sql
- id (uuid, primary key)
- date (date)
- category (text) - Custom categories allowed
- description (text)
- amount (numeric)
- notes (text, optional)
- created_at (timestamp)
- created_by (text, optional)
```

### materials_daily
```sql
- id (uuid, primary key)
- date (date)
- b_preform (numeric)
- s_preform (numeric)
- big_caps (numeric)
- small_caps (numeric)
- plastic (numeric)
- created_at (timestamp)
- created_by (text, optional)
```

### inventory_purchases
```sql
- id (uuid, primary key)
- purchase_date (date)
- category (text) - B.Preform, S.Preform, Big Caps, Small Caps, Plastic
- quantity (numeric)
- unit_cost (numeric)
- total_cost (numeric)
- supplier (text, optional)
- created_at (timestamp)
- created_by (text, optional)
```

### inventory_summary
```sql
- category (text, primary key)
- quantity_in_store (numeric)
- reorder_level (numeric)
- last_updated (timestamp)
```

## Step 5: Usage in Your JavaScript Files

### Example: Adding Production Data

```javascript
// In your form submission handler
async function handleAddProduction(formData) {
    try {
        const data = {
            date: formData.date,
            category: formData.category,
            quantity: formData.quantity,
            notes: formData.notes
        };
        
        const result = await window.db.addProduction(data);
        console.log('Production added:', result);
        loadProductions(); // Refresh the table
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add production');
    }
}
```

### Example: Loading Data into Table

```javascript
async function loadProductions() {
    try {
        const productions = await window.db.getProduction();
        // Update your table with the data
        updateTable(productions);
    } catch (error) {
        console.error('Error loading productions:', error);
    }
}
```

### Example: Editing Data

```javascript
async function editProduction(id, updatedData) {
    try {
        await window.db.updateProduction(id, updatedData);
        loadProductions(); // Refresh
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### Example: Deleting Data

```javascript
async function deleteProduction(id) {
    try {
        await window.db.deleteProduction(id);
        loadProductions(); // Refresh
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Step 6: Available Database Methods

All methods are available via `window.db`:

**Production:**
- `db.addProduction(data)`
- `db.getProduction()`
- `db.updateProduction(id, data)`
- `db.deleteProduction(id)`

**Sales:**
- `db.addSales(data)`
- `db.getSales()`
- `db.updateSales(id, data)`
- `db.deleteSales(id)`

**Expenses:**
- `db.addExpense(data)`
- `db.getExpenses()`
- `db.updateExpense(id, data)`
- `db.deleteExpense(id)`

**Materials:**
- `db.addMaterialDaily(data)`
- `db.getMaterialsDaily()`
- `db.addInventoryPurchase(data)`
- `db.getInventoryPurchases()`
- `db.getInventorySummary()`
- `db.updateInventorySummary(category, data)`

**Dashboard & Reports:**
- `db.getDashboardStats()`
- `db.getProductionReport(startDate, endDate)`
- `db.getSalesReport(startDate, endDate)`
- `db.getExpensesReport(startDate, endDate)`

## Troubleshooting

### "supabaseClient is not defined"
- Make sure `supabase-config.js` is loaded before any other scripts
- Check that the Supabase library is loaded: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`

### "Cannot read property 'from' of undefined"
- Verify your URL and ANON_KEY are correct in `supabase-config.js`
- Check that your Supabase project is active

### CORS errors
- This is normal for development. In Supabase dashboard:
  - Go to Settings → API
  - Verify CORS settings allow your domain
  - For localhost development, it should work by default

### No data appearing
- Check that your Supabase tables exist and have the correct column names
- Check browser console for error messages
- Verify Row Level Security (RLS) policies if enabled

## Security Notes

- The ANON_KEY is public and should only have read/write permissions you want users to have
- Never commit credentials to git - use environment variables in production
- Consider implementing Row Level Security (RLS) policies in Supabase for multi-user access
