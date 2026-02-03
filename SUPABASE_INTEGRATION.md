# Integrating Supabase with Your Current Functions

This guide shows how to integrate the Supabase database into your existing JavaScript functions across all pages.

## Production Page Integration

### Update handleSubmitProduction() in production.js

**Before (localStorage):**
```javascript
function handleSubmitProduction() {
    const form = document.getElementById('production-form');
    // Store to localStorage
}
```

**After (Supabase):**
```javascript
async function handleSubmitProduction() {
    const form = document.getElementById('production-form');
    
    const data = {
        date: document.getElementById('product-date').value,
        category: document.getElementById('product-category').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        notes: document.getElementById('notes').value || null
    };

    try {
        await window.db.addProduction(data);
        alert('Production record added successfully!');
        form.reset();
        loadProductions(); // Refresh table
    } catch (error) {
        alert('Error adding production: ' + error.message);
    }
}
```

### Update editProduction() in production.js

**After (Supabase):**
```javascript
async function editProduction(id) {
    const newQuantity = prompt('Enter new quantity:');
    if (newQuantity !== null) {
        try {
            await window.db.updateProduction(id, { quantity: parseFloat(newQuantity) });
            loadProductions(); // Refresh
        } catch (error) {
            alert('Error updating: ' + error.message);
        }
    }
}
```

### Update deleteProduction() in production.js

**After (Supabase):**
```javascript
async function deleteProduction(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        try {
            await window.db.deleteProduction(id);
            loadProductions(); // Refresh
        } catch (error) {
            alert('Error deleting: ' + error.message);
        }
    }
}
```

### Add loadProductions() function

**New function:**
```javascript
async function loadProductions() {
    try {
        const productions = await window.db.getProduction();
        
        // Build table HTML
        const tbody = document.getElementById('production-tbody');
        tbody.innerHTML = '';
        
        productions.forEach(record => {
            const row = `
                <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-4 py-3 text-sm">${new Date(record.date).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.category}</td>
                    <td class="px-4 py-3 text-sm font-semibold">${record.quantity}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${record.notes || '-'}</td>
                    <td class="px-4 py-3 text-sm flex gap-2">
                        <button onclick="editProduction('${record.id}')" class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteProduction('${record.id}')" class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading productions:', error);
    }
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadProductions);
```

## Sales Page Integration

### Update handleAddSales() in sales.js

**After (Supabase):**
```javascript
async function handleAddSales() {
    const data = {
        date: new Date().toISOString().split('T')[0],
        customer_name: document.getElementById('customer-name').value,
        product: document.getElementById('product').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        unit_price: parseFloat(document.getElementById('unit-price').value),
        total_amount: parseFloat(document.getElementById('total-amount').value),
        payment_method: document.getElementById('payment-method').value,
        notes: document.getElementById('notes').value || null
    };

    try {
        await window.db.addSales(data);
        alert('Sales entry added successfully!');
        document.getElementById('sales-form').reset();
        loadSales();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

### Load sales data on page load

**New function:**
```javascript
async function loadSales() {
    try {
        const sales = await window.db.getSales();
        
        const tbody = document.getElementById('sales-tbody');
        tbody.innerHTML = '';
        
        sales.forEach(record => {
            const row = `
                <tr class="border-b border-slate-200 dark:border-slate-700">
                    <td class="px-4 py-3 text-sm">${new Date(record.date).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.customer_name}</td>
                    <td class="px-4 py-3 text-sm">${record.product}</td>
                    <td class="px-4 py-3 text-sm text-right">${record.total_amount.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm flex gap-2">
                        <button onclick="editSales('${record.id}')" class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteSales('${record.id}')" class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadSales);
```

## Expenses Page Integration

### Update handleAddExpense() in expenses.js

**After (Supabase):**
```javascript
async function handleAddExpense() {
    const data = {
        date: new Date().toISOString().split('T')[0],
        category: document.getElementById('expense-category').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        notes: document.getElementById('notes').value || null
    };

    try {
        await window.db.addExpense(data);
        alert('Expense recorded successfully!');
        document.getElementById('expense-form').reset();
        loadExpenses();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

### Add loadExpenses() function

```javascript
async function loadExpenses() {
    try {
        const expenses = await window.db.getExpenses();
        
        const tbody = document.getElementById('expenses-tbody');
        tbody.innerHTML = '';
        
        expenses.forEach(record => {
            const row = `
                <tr class="border-b border-slate-200 dark:border-slate-700">
                    <td class="px-4 py-3 text-sm">${new Date(record.date).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.category}</td>
                    <td class="px-4 py-3 text-sm">${record.description}</td>
                    <td class="px-4 py-3 text-sm text-right font-semibold">${record.amount.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm flex gap-2">
                        <button onclick="editExpense('${record.id}')" class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteExpense('${record.id}')" class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadExpenses);
```

## Materials Page Integration

### Update handleSubmitDailyMaterial() in materials.js

**After (Supabase):**
```javascript
async function handleSubmitDailyMaterial() {
    const data = {
        date: document.getElementById('material-date').value,
        b_preform: parseFloat(document.getElementById('b-preform').value) || 0,
        s_preform: parseFloat(document.getElementById('s-preform').value) || 0,
        big_caps: parseFloat(document.getElementById('big-caps').value) || 0,
        small_caps: parseFloat(document.getElementById('small-caps').value) || 0,
        plastic: parseFloat(document.getElementById('plastic-used').value) || 0
    };

    try {
        await window.db.addMaterialDaily(data);
        alert('Daily materials recorded!');
        document.getElementById('daily-form').reset();
        loadDailyMaterials();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

### Update handleSubmitInventoryPurchase() in materials.js

**After (Supabase):**
```javascript
async function handleSubmitInventoryPurchase() {
    const data = {
        purchase_date: document.getElementById('purchase-date').value,
        category: document.getElementById('purchase-category').value,
        quantity: parseFloat(document.getElementById('purchase-quantity').value),
        unit_cost: parseFloat(document.getElementById('unit-cost').value),
        total_cost: parseFloat(document.getElementById('total-cost').value),
        supplier: document.getElementById('supplier').value || null
    };

    try {
        await window.db.addInventoryPurchase(data);
        alert('Purchase recorded!');
        document.getElementById('purchase-form').reset();
        loadPurchases();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

## Dashboard Page Integration

### Load all stats on dashboard load

**New function:**
```javascript
async function loadDashboardStats() {
    try {
        const stats = await window.db.getDashboardStats();
        
        // Update Today's Revenue
        const totalRevenue = stats.sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
        document.getElementById('today-revenue').textContent = '$' + totalRevenue.toFixed(2);
        
        // Update Total Expenses
        const totalExpenses = stats.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        document.getElementById('total-expenses').textContent = '$' + totalExpenses.toFixed(2);
        
        // Update Production Units
        const totalUnits = stats.production.reduce((sum, prod) => sum + (prod.quantity || 0), 0);
        document.getElementById('total-units').textContent = totalUnits.toLocaleString();
        
        // Update Materials Count
        document.getElementById('materials-count').textContent = stats.materials.length;
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadDashboardStats);
```

## Testing the Connection

1. Open the browser console (F12)
2. Try this command:
   ```javascript
   window.db.getProduction().then(data => console.log('Productions:', data))
   ```
3. You should see your production data logged

If you see an error, check:
- Supabase URL and ANON_KEY in `supabase-config.js`
- Table names match exactly in your Supabase database
- Supabase scripts are loaded (check Network tab in DevTools)

## Next Steps

1. Update `supabase-config.js` with your actual Supabase credentials
2. Update each JavaScript file with the new Supabase functions
3. Test each page to ensure data loads correctly
4. Verify data appears in Supabase dashboard

All functions support async/await for easy error handling!
