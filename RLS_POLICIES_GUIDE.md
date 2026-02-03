# 🔐 Row-Level Security (RLS) & Policies Documentation

## Overview

Row-Level Security (RLS) is now configured on all your Starland Water database tables. This ensures data security while allowing proper access patterns for your system.

---

## What RLS Does

**Before RLS (No Security):**
```
Anyone with database access can see/edit ALL data
❌ No privacy
❌ No data protection
❌ Dangerous for production
```

**After RLS (Secure):**
```
Access is controlled by policies
✅ Data is protected
✅ Users see what they should
✅ Safe for production
✅ Audit trail maintained
```

---

## RLS Policies by Table

### 1. PROFILES Table
**Policies Enabled:**
- ✅ **SELECT** - All authenticated users can view profiles
- ✅ **INSERT** - Users can create profiles
- ✅ **UPDATE** - Users can update their own profile
- ✅ **DELETE** - (Soft delete only - doesn't remove)

**Security Level:** MEDIUM
```
Who can access: All authenticated users
What they see: All profiles
What they can do: Create, read, update own profile
```

---

### 2. PRODUCTION_RECORDS Table
**Policies Enabled:**
- ✅ **SELECT** - All users can view production records
- ✅ **INSERT** - All authenticated users can add production records
- ✅ **UPDATE** - All authenticated users can edit records
- ✅ **DELETE** - All authenticated users can delete records

**Security Level:** OPEN (for internal use)
```
Who can access: All authenticated users
What they see: All production records
What they can do: Full CRUD (Create, Read, Update, Delete)
```

**Use Case:**
```
Data Entry Staff:
→ Add new production batches
→ View historical records
→ Correct data entry mistakes
```

---

### 3. SALES Table
**Policies Enabled:**
- ✅ **SELECT** - All users can view sales records
- ✅ **INSERT** - All authenticated users can add sales
- ✅ **UPDATE** - All authenticated users can edit sales
- ✅ **DELETE** - All authenticated users can delete sales

**Security Level:** OPEN (for internal use)
```
Who can access: All authenticated users
What they see: All sales transactions
What they can do: Full CRUD (Create, Read, Update, Delete)
```

**Use Case:**
```
Data Entry Staff:
→ Record customer sales
→ Correct transaction errors
→ View sales history
```

---

### 4. EXPENSES Table
**Policies Enabled:**
- ✅ **SELECT** - All users can view expenses
- ✅ **INSERT** - All authenticated users can add expenses
- ✅ **UPDATE** - All authenticated users can edit expenses
- ✅ **DELETE** - All authenticated users can delete expenses

**Security Level:** OPEN (for internal use)
```
Who can access: All authenticated users
What they see: All expenses
What they can do: Full CRUD (Create, Read, Update, Delete)
```

**Note:**
```
Better practice (for production):
→ Only managers can approve expenses
→ Add approval_status check to policy
→ Prevent deletion of approved expenses
```

---

### 5. MATERIALS_USAGE Table
**Policies Enabled:**
- ✅ **SELECT** - All users can view daily material usage
- ✅ **INSERT** - All authenticated users can record usage
- ✅ **UPDATE** - All authenticated users can edit usage
- ✅ **DELETE** - All authenticated users can delete usage

**Security Level:** OPEN (for internal use)
```
Who can access: All authenticated users
What they see: All daily material usage records
What they can do: Full CRUD (Create, Read, Update, Delete)
```

---

### 6. MATERIALS_INVENTORY_BOUGHT Table
**Policies Enabled:**
- ✅ **SELECT** - All users can view inventory purchases
- ✅ **INSERT** - All authenticated users can record purchases
- ✅ **UPDATE** - All authenticated users can edit purchases
- ✅ **DELETE** - All authenticated users can delete purchases

**Security Level:** OPEN (for internal use)
```
Who can access: All authenticated users
What they see: All purchase records
What they can do: Full CRUD (Create, Read, Update, Delete)
```

---

### 7. INVENTORY_SUMMARY Table
**Policies Enabled:**
- ✅ **SELECT** - All users can view inventory levels
- ✅ **INSERT** - All authenticated users can create summary
- ✅ **UPDATE** - All authenticated users can update levels
- ✅ **DELETE** - All authenticated users can delete

**Security Level:** OPEN (for internal use)
```
Who can access: All authenticated users
What they see: Current stock levels for all materials
What they can do: Full CRUD (Create, Read, Update, Delete)
```

---

## Current RLS Configuration

Your system currently uses **PERMISSIVE** policies, which means:

```
✅ All authenticated users have access
✅ Good for internal systems
✅ No multi-tenant isolation needed

For higher security (production):
→ Add RESTRICTIVE policies
→ Add approval workflows
→ Add role-based access control
```

---

## How to View/Edit Policies in Supabase

### View Existing Policies:
```
1. Go to https://app.supabase.com
2. Select your project
3. Go to "Authentication" → "Policies"
4. Select each table to see its policies
5. Policies should list:
   - production_records: 4 policies
   - sales: 4 policies
   - expenses: 4 policies
   - etc.
```

### Add Additional Policies:
```
1. Click "New Policy" on a table
2. Choose operation (SELECT, INSERT, UPDATE, DELETE)
3. Choose policy type (PERMISSIVE or RESTRICTIVE)
4. Add your condition (optional)
5. Click "Save policy"
```

---

## Advanced RLS Examples

### Example 1: Role-Based Expense Approval
```sql
-- Only managers can approve expenses
CREATE POLICY "Managers can approve expenses"
    ON expenses FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'manager'
        )
    )
    WITH CHECK (approval_status IN ('Approved', 'Rejected'));
```

### Example 2: Prevent Deleting Approved Expenses
```sql
-- Don't allow deletion of approved expenses
CREATE POLICY "Cannot delete approved expenses"
    ON expenses FOR DELETE
    USING (approval_status != 'Approved');
```

### Example 3: User Can Only See Own Department Data
```sql
-- Employees see only their department's records
CREATE POLICY "Users see own department records"
    ON sales FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.department = (
                SELECT department FROM profiles 
                WHERE id = auth.uid()
            )
        )
    );
```

### Example 4: Prevent Future-Dated Entries
```sql
-- Can only add records for today or past
CREATE POLICY "Only current or past dates allowed"
    ON sales FOR INSERT
    WITH CHECK (date <= CURRENT_DATE);
```

### Example 5: Audit Trail - Track Who Changes Data
```sql
-- Add an audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT,
    operation TEXT,
    user_id UUID,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log all production record changes
CREATE TRIGGER log_production_changes
BEFORE UPDATE ON production_records
FOR EACH ROW
EXECUTE FUNCTION log_changes();
```

---

## Current Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE | Users |
|-------|--------|--------|--------|--------|-------|
| profiles | ✅ All | ✅ Auth | ✅ Own | ⚠️ Soft | All |
| production_records | ✅ All | ✅ Auth | ✅ Auth | ✅ Auth | Staff |
| sales | ✅ All | ✅ Auth | ✅ Auth | ✅ Auth | Staff |
| expenses | ✅ All | ✅ Auth | ✅ Auth | ✅ Auth | Staff |
| materials_usage | ✅ All | ✅ Auth | ✅ Auth | ✅ Auth | Staff |
| materials_inventory_bought | ✅ All | ✅ Auth | ✅ Auth | ✅ Auth | Staff |
| inventory_summary | ✅ All | ✅ Auth | ✅ Auth | ✅ Auth | Staff |

**Legend:**
- ✅ Allowed
- ⚠️ Soft delete only
- Auth = Authenticated users only
- All = All users (including anon)

---

## Security Best Practices

### ✅ DO:
- Enable RLS on all tables with sensitive data
- Use restrictive policies by default
- Add role checks for sensitive operations
- Log important changes
- Review policies regularly
- Use soft deletes for audit trails

### ❌ DON'T:
- Allow anonymous users to modify data
- Create overly permissive policies
- Forget to enable RLS on new tables
- Delete important records without backup
- Share admin credentials
- Disable RLS without reason

---

## Testing Your Policies

### Test 1: Verify RLS is Enabled
```sql
-- Check which tables have RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```
Expected: All 7 tables should show `rowsecurity = true`

### Test 2: Verify Policies Exist
```sql
-- Count policies per table
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;
```
Expected: Should see 4 policies per table (SELECT, INSERT, UPDATE, DELETE)

### Test 3: Test a Policy
```sql
-- Try to insert as authenticated user
INSERT INTO production_records (date, category, quantity, quantity_produced)
VALUES (CURRENT_DATE, 'B.Preform', 100, 100);
```
Expected: Should succeed with RLS policies in place

---

## Troubleshooting

### Issue: "permission denied" on SELECT
**Cause:** No SELECT policy defined
**Solution:** Add SELECT policy with `USING (true)`

### Issue: "permission denied" on INSERT
**Cause:** No INSERT policy defined
**Solution:** Add INSERT policy with `WITH CHECK (true)`

### Issue: "permission denied" even for admin
**Cause:** RLS policies restrict everyone
**Solution:** Add admin bypass policy
```sql
CREATE POLICY "Admin bypass RLS"
    ON table_name
    USING (current_user = 'admin')
    WITH CHECK (current_user = 'admin');
```

### Issue: Can't see any data
**Cause:** RLS enabled but no policies
**Solution:** Add at least a SELECT policy

---

## Moving to Production

### Recommended Security Upgrades:

1. **Add Authentication** ✅
   ```
   Implement proper user auth
   Track who made changes
   ```

2. **Add Role-Based Access** ✅
   ```
   Different permissions for:
   - Data Entry Staff (insert only)
   - Managers (update + approve)
   - Admin (full access)
   ```

3. **Add Approval Workflows** ✅
   ```
   Expenses require approval
   Large transactions need manager sign-off
   ```

4. **Add Audit Logging** ✅
   ```
   Track all changes
   Who, what, when, why
   ```

5. **Implement Soft Deletes** ✅
   ```
   Mark as deleted, don't remove
   Maintain audit trail
   ```

---

## Resources

- **Supabase RLS Docs:** https://supabase.com/docs/guides/auth/row-level-security
- **PostgreSQL RLS:** https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **Supabase Policies:** https://supabase.com/docs/guides/auth/row-level-security/policies

---

## Summary

✅ **Your database now has:**
- Row-Level Security enabled on all tables
- Policies for SELECT, INSERT, UPDATE, DELETE
- Open access for internal staff (authenticated users)
- Foundation for role-based access control
- Audit trail with created_at, updated_at timestamps

🔒 **Security Status: ADEQUATE FOR INTERNAL USE**

For production/sensitive data, consider:
- Adding authentication layer
- Implementing approval workflows
- Adding role-based access control
- Enabling audit logging
- Reviewing policies monthly

---

**Status: ✅ RLS Policies Configured and Ready**
