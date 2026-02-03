# 💰 Sales Debt Tracking Feature - Implementation Guide

## Overview
The Sales module now has complete debt tracking functionality with real-time calculation of amounts paid and remaining balances.

---

## ✅ What's Been Added

### 1. **Form Fields** (management/sales.html)
New fields in the "New Sales Entry" form:
- **Total Amount (KES)** - The full sale amount
- **Amount Paid (KES)** - How much the customer has paid
- **Amount Remaining (KES)** - Auto-calculated (Total - Paid)

### 2. **Table Columns** (management/sales.html)
The transaction table now shows:
- Date
- Customer Name
- Product
- Quantity
- **Total (KES)** - Full sale amount
- **Paid (KES)** - Amount paid by customer
- **Remaining (KES)** - Outstanding balance
- **Status Badge** - Visual indicator (Paid / Partial / Pending)
- Actions (Edit / Delete)

### 3. **Edit Modal** (management/sales.html)
When editing a sale, you can now modify:
- Customer Name
- Product
- Quantity
- Total Amount
- Amount Paid
- Amount Remaining (auto-calculated)

### 4. **Database Fields** (CREATE_DATABASE_SCHEMA.sql)
New columns in sales table:
```sql
amount_paid NUMERIC(12, 2) DEFAULT 0,
amount_remaining NUMERIC(12, 2) DEFAULT 0
```

---

## 🔧 How It Works

### Auto-Calculation
When you enter or update values:
```
Amount Remaining = Total Amount - Amount Paid
```

Functions that handle calculation:
- `calculateRemaining()` - For new sales form
- `calculateEditRemaining()` - For edit modal
- Auto-triggers on field change via `onchange` event

### Payment Status Badges
Status is automatically determined based on remaining balance:
| Status | Condition | Badge Color |
|--------|-----------|-------------|
| **Paid** | Remaining = 0 | ✅ Green |
| **Pending** | Remaining = Total | 🟡 Amber |
| **Partial** | 0 < Remaining < Total | 🔵 Blue |

### Display Logic
- **Remaining amount displayed in amber/amber-400** when unpaid
- **Remaining amount displayed in green/green-400** when fully paid
- Status badge shows payment condition at a glance

---

## 📝 JavaScript Functions (js/sales.js)

### 1. `calculateRemaining()`
Calculates remaining amount for new sales
```javascript
function calculateRemaining() {
    const total = parseFloat(document.getElementById('saleTotal').value) || 0;
    const paid = parseFloat(document.getElementById('salePaid').value) || 0;
    const remaining = Math.max(0, total - paid);
    document.getElementById('saleRemaining').value = remaining.toFixed(2);
}
```

### 2. `calculateEditRemaining()`
Calculates remaining amount when editing
```javascript
function calculateEditRemaining() {
    const total = parseFloat(document.getElementById('editTotalAmount').value) || 0;
    const paid = parseFloat(document.getElementById('editAmountPaid').value) || 0;
    const remaining = Math.max(0, total - paid);
    document.getElementById('editAmountRemaining').value = remaining.toFixed(2);
}
```

### 3. `getPaymentStatus(remaining, total)`
Determines payment status
```javascript
function getPaymentStatus(remaining, total) {
    if (remaining === 0) return 'Paid';
    if (remaining === total) return 'Pending';
    return 'Partial';
}
```

### 4. `getStatusBadge(status)`
Generates HTML badge with styling
```javascript
function getStatusBadge(status) {
    // Returns colored badge matching status
}
```

### 5. `loadSalesData()`
Updated to show debt columns
```javascript
// Now displays:
// - Total Amount
// - Amount Paid
// - Amount Remaining
// - Status badge
```

---

## 🗄️ Database Setup

### Option 1: Fresh Installation
Run the complete database schema:
```bash
# In Supabase SQL Editor
1. Copy entire content of: CREATE_DATABASE_SCHEMA.sql
2. Run in Supabase
```

### Option 2: Existing Sales Table
Add debt tracking to existing tables:
```bash
# In Supabase SQL Editor
1. Copy content of: ADD_DEBT_TRACKING.sql
2. Run in Supabase
3. This will:
   - Add amount_paid column (default 0)
   - Add amount_remaining column (default 0)
   - Auto-calculate for existing records
   - Create trigger for future records
```

---

## 💡 Usage Examples

### Example 1: Full Payment
```
Total Amount: 1000 KES
Amount Paid: 1000 KES
Amount Remaining: 0 KES ✅
Status: PAID (Green Badge)
```

### Example 2: No Payment Yet
```
Total Amount: 5000 KES
Amount Paid: 0 KES
Amount Remaining: 5000 KES
Status: PENDING (Amber Badge)
```

### Example 3: Partial Payment
```
Total Amount: 10000 KES
Amount Paid: 6000 KES
Amount Remaining: 4000 KES
Status: PARTIAL (Blue Badge)
```

---

## 📊 Key Features

✅ **Real-time Calculation**
- Amount Remaining auto-updates as you type
- No manual entry needed

✅ **Visual Indicators**
- Color-coded badges (Green/Amber/Blue)
- Quick glance at payment status

✅ **Edit Support**
- Can update amount paid anytime
- Remaining amount recalculates

✅ **Database Persistence**
- All debt data stored in Supabase
- Automatic triggers for calculations

✅ **Full Integration**
- Works with existing system
- No conflicts with other modules

---

## 🚀 Next Steps

1. **Update Database**
   - Run ADD_DEBT_TRACKING.sql if you have existing data
   - Or run CREATE_DATABASE_SCHEMA.sql for fresh setup

2. **Test the Feature**
   - Open management/sales.html
   - Add a new sale with different amounts
   - Edit existing sales to update payment amounts
   - Verify calculations and status badges

3. **Optional Enhancements**
   - Create a debt report showing all unpaid invoices
   - Add email notifications for pending payments
   - Generate payment reminders
   - Track payment history

---

## 🛠️ Technical Details

### Fields in Sales Table
```sql
amount_paid NUMERIC(12, 2)           -- Amount customer has paid
amount_remaining NUMERIC(12, 2)      -- Outstanding balance (auto-calculated)
```

### Auto-Calculation Trigger (Optional)
Database trigger automatically updates amount_remaining:
```sql
CREATE TRIGGER sales_amount_remaining_trigger
BEFORE INSERT OR UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_amount_remaining();
```

### Form IDs
```html
<!-- New Sales Form -->
<input id="saleTotal" />           <!-- Total Amount -->
<input id="salePaid" />            <!-- Amount Paid -->
<input id="saleRemaining" />       <!-- Amount Remaining (readonly) -->

<!-- Edit Modal -->
<input id="editTotalAmount" />     <!-- Total Amount (edit) -->
<input id="editAmountPaid" />      <!-- Amount Paid (edit) -->
<input id="editAmountRemaining" /> <!-- Amount Remaining (edit, readonly) -->
```

---

## ✨ Summary

Your Sales module now tracks debt comprehensively:
- ✅ Track amount paid vs total amount
- ✅ Auto-calculate remaining balance
- ✅ Visual payment status indicators
- ✅ Edit anytime to update payments
- ✅ Full database persistence
- ✅ Works with existing system

**The system will automatically calculate and update remaining amounts based on payments made!**
