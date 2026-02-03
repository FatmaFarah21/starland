# 💳 DEBT TRACKING - QUICK START

## What Changed
Added complete debt tracking to Sales module with:
- **Total Amount** - Full sale price
- **Amount Paid** - What customer paid
- **Amount Remaining** - Auto-calculated balance

---

## In Sales Page

### Form (Top Section)
```
Total Amount (KES)     ← Enter full price
Amount Paid (KES)      ← Enter payment
Amount Remaining (KES) ← Auto-fills!
```

### Table (Bottom Section)
Shows all columns:
```
Date | Customer | Product | Qty | Total | Paid | Remaining | Status | Actions
```

Status Badges:
- 🟢 **Paid** - Fully paid (Remaining = 0)
- 🟡 **Pending** - Not paid (Remaining = Total)
- 🔵 **Partial** - Partially paid

---

## How to Use

### 1. Add New Sale
1. Enter customer name, product, quantity
2. Enter **Total Amount (KES)**
3. Enter **Amount Paid (KES)**
4. **Amount Remaining auto-fills**
5. Click "Add Sale"

### 2. Update Payment
1. Click **Edit** on a sale
2. Change "Amount Paid (KES)"
3. **Amount Remaining auto-updates**
4. Click "Save"

### 3. Check Status
Look at the **Status** column:
- Green = Customer paid in full ✅
- Amber = Customer hasn't paid yet ⏳
- Blue = Customer paid partially 💳

---

## Examples

**Sale 1: Full Payment**
```
Total: 1000 KES
Paid:  1000 KES
Remaining: 0 KES → Status: PAID ✅
```

**Sale 2: No Payment**
```
Total: 5000 KES
Paid:  0 KES
Remaining: 5000 KES → Status: PENDING 🟡
```

**Sale 3: Partial Payment**
```
Total: 10000 KES
Paid:  6000 KES
Remaining: 4000 KES → Status: PARTIAL 🔵
```

---

## Database Setup (Do This First!)

### If New Database:
1. Go to Supabase SQL Editor
2. Copy `CREATE_DATABASE_SCHEMA.sql`
3. Run it ✅

### If Existing Database:
1. Go to Supabase SQL Editor
2. Copy `ADD_DEBT_TRACKING.sql`
3. Run it ✅

---

## Files Modified
✅ management/sales.html - Added form fields and table columns
✅ js/sales.js - Added calculation functions
✅ CREATE_DATABASE_SCHEMA.sql - Added DB columns
✅ ADD_DEBT_TRACKING.sql - Migration script (for existing databases)

---

## That's It! 🎉
Your Sales page now fully tracks debt with automatic calculations!
