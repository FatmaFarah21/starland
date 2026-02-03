# 🗂️ STARLAND WATER DATABASE DIAGRAM

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STARLAND WATER FINANCIAL SYSTEM                          │
│                         Database Architecture                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌────────────────┐
                              │   SUPABASE     │
                              │  (PostgreSQL)  │
                              └────────────────┘
                                      │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
                ▼                       ▼                       ▼
        ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
        │   PROFILES   │       │ PRODUCTION   │       │    SALES     │
        │  (Users)     │       │   RECORDS    │       │(Transactions)│
        ├──────────────┤       ├──────────────┤       ├──────────────┤
        │ id (UUID)    │       │ id (UUID)    │       │ id (UUID)    │
        │ email        │       │ date         │       │ date         │
        │ full_name    │       │ category     │       │ customer     │
        │ role         │       │ quantity     │       │ product      │
        │ department   │       │ notes        │       │ amount       │
        │ phone        │       │ created_by   │       │ payment_sts  │
        │ is_active    │       │ timestamps   │       │ timestamps   │
        └──────────────┘       └──────────────┘       └──────────────┘
                │                       │                       │
                └───────────────────────┴───────────────────────┘
                                       │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
                ▼                       ▼                       ▼
        ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
        │  EXPENSES    │       │  MATERIALS   │       │ MATERIALS    │
        │(Transactions)│       │   USAGE      │       │ INVENTORY    │
        ├──────────────┤       ├──────────────┤       │  BOUGHT      │
        │ id (UUID)    │       │ id (UUID)    │       ├──────────────┤
        │ date         │       │ date         │       │ id (UUID)    │
        │ category     │       │ b_preform    │       │ purchase_dt  │
        │ description  │       │ s_preform    │       │ category     │
        │ amount       │       │ big_caps     │       │ quantity     │
        │ payment_sts  │       │ small_caps   │       │ unit_cost    │
        │ approval_sts │       │ plastic      │       │ total_cost   │
        │ notes        │       │ recorded_by  │       │ supplier     │
        │ timestamps   │       │ timestamps   │       │ invoice_num  │
        └──────────────┘       └──────────────┘       │ payment_sts  │
                │                       │              │ timestamps   │
                │                       │              └──────────────┘
                │                       │                       │
                └───────────────────────┴───────────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────┐
                        │  INVENTORY SUMMARY       │
                        │ (Current Stock Levels)   │
                        ├──────────────────────────┤
                        │ category (TEXT, PK)      │
                        │ quantity_in_store        │
                        │ reorder_level            │
                        │ last_received_date       │
                        │ last_issued_date         │
                        │ unit_of_measure          │
                        │ notes                    │
                        │ updated_at               │
                        └──────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER INTERFACES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DATA ENTRY PORTAL          │      MANAGEMENT DASHBOARD        │
│  ─────────────────          │      ─────────────────────       │
│  • Production Entry         │      • Reports & Analytics        │
│  • Sales Entry              │      • Expense Approval           │
│  • Expense Entry            │      • Inventory Status           │
│  • Materials Usage          │      • Settings & Admin           │
│  • Dashboard                │      • Dashboard                  │
│                             │                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │   HTML Pages (Tailwind)    │
                │  (JavaScript Front-end)    │
                └────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │  Supabase JavaScript SDK   │
                │  (Async Queries)           │
                └────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │    Supabase Database Helper           │
         │  (Window.db Global Instance)          │
         │                                       │
         │  Methods:                             │
         │  • addProduction()                    │
         │  • getSales()                         │
         │  • updateExpense()                    │
         │  • getMaterialsDaily()                │
         │  • ... 20+ more                       │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │    Supabase REST API                  │
         │  (PostgreSQL Queries)                 │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │    PostgreSQL Database                │
         │  (7 Tables + 3 Views)                 │
         │                                       │
         │  URL: dvtjtvpuyokfmlwurlmx.supabase.co│
         └───────────────────────────────────────┘
```

---

## Table Relationships

```
PROFILES
   │
   ├─→ created_by ──→ PRODUCTION_RECORDS
   ├─→ created_by ──→ SALES
   └─→ created_by ──→ EXPENSES

PRODUCTION_RECORDS
   └─→ Records daily output
       └─→ Data flows to → INVENTORY_SUMMARY

SALES
   ├─→ customer_name
   ├─→ product
   └─→ total_amount ──→ Dashboard Analytics

EXPENSES
   ├─→ approval_status (Pending/Approved)
   ├─→ category (Utilities, Salaries, etc)
   └─→ amount ──→ Dashboard Analytics

MATERIALS_USAGE
   ├─→ date-based tracking
   ├─→ 5 material types tracked daily
   └─→ Data flows to → INVENTORY_SUMMARY

MATERIALS_INVENTORY_BOUGHT
   ├─→ supplier tracking
   ├─→ purchase records
   ├─→ payment_status tracking
   └─→ Updates → INVENTORY_SUMMARY

INVENTORY_SUMMARY
   ├─ Acts as aggregated view
   ├─ Current stock of 5 material types
   └─ Triggers reorder alerts when < reorder_level
```

---

## Key Features by Module

```
┌──────────────────────────────────────────────────────────────┐
│                    PRODUCTION MODULE                         │
├──────────────────────────────────────────────────────────────┤
│ ✓ Track daily production by category                         │
│ ✓ Record: B.Preform, B.Loading, B.Store, S.Preform, etc     │
│ ✓ Add notes and production comments                          │
│ ✓ View/Edit/Delete historical records                        │
│ ✓ Track by: Date, Category, Quantity, Created By            │
│ Database Table: production_records                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      SALES MODULE                            │
├──────────────────────────────────────────────────────────────┤
│ ✓ Record customer transactions                               │
│ ✓ Track: Customer, Product, Quantity, Price                 │
│ ✓ Payment method tracking (Cash, Mobile, Bank, Cheque)       │
│ ✓ Payment status monitoring (Completed, Pending, Failed)     │
│ ✓ Auto-calculate totals                                      │
│ ✓ Historical records and analytics                           │
│ Database Table: sales                                        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     EXPENSES MODULE                          │
├──────────────────────────────────────────────────────────────┤
│ ✓ Track all business expenses                                │
│ ✓ Categories: Utilities, Salaries, Supplies, Maintenance    │
│ ✓ Approval workflow (Pending → Approved/Rejected)            │
│ ✓ Receipt tracking and audit trail                           │
│ ✓ Payment method tracking                                    │
│ Database Table: expenses                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   MATERIALS MODULE                           │
├──────────────────────────────────────────────────────────────┤
│ ✓ Track daily material consumption (5 types)                 │
│ ✓ Record inventory purchases from suppliers                  │
│ ✓ Maintain current stock levels                              │
│ ✓ Automatic reorder alerts (when < reorder_level)            │
│ ✓ Supplier tracking and invoice management                   │
│ Database Tables:                                             │
│   - materials_usage (daily tracking)                         │
│   - materials_inventory_bought (purchases)                   │
│   - inventory_summary (current levels)                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   DASHBOARD MODULE                           │
├──────────────────────────────────────────────────────────────┤
│ ✓ Real-time revenue tracking                                 │
│ ✓ Expense monitoring                                         │
│ ✓ Production statistics                                      │
│ ✓ Quick access to all modules                                │
│ ✓ Recent activity feed                                       │
│ Data Sources: All tables via views                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Database Views (Automatic Summaries)

```
┌─────────────────────────────────────────────────────────────────┐
│  sales_daily_summary VIEW                                       │
│  ───────────────────────                                        │
│  Purpose: Quick daily sales totals without complex queries      │
│                                                                 │
│  Columns:                                                       │
│  • date - The date                                              │
│  • transaction_count - How many sales today                     │
│  • daily_revenue - Total sales amount today                     │
│  • avg_transaction_value - Average sale size                    │
│                                                                 │
│  Updated: Automatically when sales table changes               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  expenses_summary VIEW                                          │
│  ──────────────────                                             │
│  Purpose: Expense breakdown by category                         │
│                                                                 │
│  Columns:                                                       │
│  • category - Expense category                                  │
│  • total_spent - Total amount in that category                  │
│  • transaction_count - How many expenses                        │
│  • avg_expense - Average expense size                           │
│                                                                 │
│  Updated: Automatically when expenses table changes            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  inventory_status VIEW                                          │
│  ──────────────────                                             │
│  Purpose: Stock level warnings                                  │
│                                                                 │
│  Columns:                                                       │
│  • category - Material type                                     │
│  • quantity_in_store - Current amount                           │
│  • reorder_level - Minimum amount needed                        │
│  • status - "REORDER NEEDED", "LOW STOCK", or "ADEQUATE"        │
│                                                                 │
│  Uses: Alerts when inventory falls below safe levels           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Integrity Features

```
✓ CONSTRAINTS:
  • Positive values only: quantity > 0, amounts > 0
  • Unique emails in profiles
  • Not null fields validated

✓ AUTO-GENERATION:
  • UUIDs for all primary keys (globally unique)
  • Timestamps (created_at, updated_at)
  • Dates default to TODAY if not specified

✓ INDEXES:
  • Fast date-based queries
  • Fast category searches
  • Fast customer lookups
  • Fast supplier queries

✓ FOREIGN KEY POTENTIAL:
  • Can add relationships between tables later if needed
  • Current setup allows flexibility
```

---

## Backup & Recovery

```
Supabase automatically:
✓ Backs up database daily
✓ Maintains 7-day backup history
✓ Point-in-time recovery available
✓ Zero data loss guarantee

Your responsibility:
• Regularly export critical data
• Keep credentials secure
• Monitor quota usage
• Enable RLS policies for security
```

---

## Performance Optimizations

```
✓ Indexes on:
  • Date columns (for fast date filtering)
  • Category columns (for grouping/filtering)
  • Customer names (for lookups)
  • Supplier names (for lookups)

✓ Views:
  • Pre-calculated summaries
  • Avoid complex calculations in app
  • Lightning-fast reporting

✓ Connection Pooling:
  • Supabase handles automatically
  • Optimized for web apps
  • No manual pool management needed
```

---

**Status: ✅ Complete Database Design Ready for Implementation**
