import { supabase } from './config.js';
import { requireAuth, signOut, getCurrentRole } from './auth.js';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadDashboardSummary() {
  const totalRevenueEl = document.getElementById('metricTotalRevenue');
  const totalExpensesEl = document.getElementById('metricTotalExpenses');
  const netIncomeEl = document.getElementById('metricNetIncome');

  if (!totalRevenueEl || !totalExpensesEl || !netIncomeEl) return;

  // Show different ranges for management vs data-entry dashboards
  // - Management dashboard: all data ever entered
  // - Data-entry dashboard: current month's data
  const isManagementDashboard = window.location.pathname.includes('/management/dashboard.html');

  let salesQuery = supabase.from('sales').select('total_amount');
  let expensesQuery = supabase.from('expenses').select('amount');

  if (!isManagementDashboard) {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1); // first day of this month
    const fromStr = formatDateInput(from);

    salesQuery = salesQuery.gte('sale_date', fromStr);
    expensesQuery = expensesQuery.gte('expense_date', fromStr);
  }

  const [
    { data: salesRows, error: salesError },
    { data: expenseRows, error: expensesError },
  ] = await Promise.all([salesQuery, expensesQuery]);

  if (salesError || expensesError) {
    console.error('Error loading dashboard summary', { salesError, expensesError });
    totalRevenueEl.textContent = 'Error';
    totalExpensesEl.textContent = 'Error';
    netIncomeEl.textContent = 'Error';
    return;
  }

  const totalSales = (salesRows || []).reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
  const totalExpenses = (expenseRows || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const net = totalSales - totalExpenses;

  totalRevenueEl.textContent = `KES ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  totalExpensesEl.textContent = `KES ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  netIncomeEl.textContent = `KES ${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Load detailed data for management dashboard
  if (isManagementDashboard) {
    await loadManagementDetails();
  }
}

async function loadManagementDetails() {
  // Production data
  const { data: productionData } = await supabase
    .from('production_records')
    .select('record_date, category, quantity, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const productionSummaryEl = document.getElementById('productionSummary');
  const productionListEl = document.getElementById('productionList');
  
  if (productionSummaryEl && productionListEl) {
    const totalProduction = (productionData || []).reduce((sum, r) => sum + Number(r.quantity || 0), 0);
    productionSummaryEl.innerHTML = `Total Records: ${productionData?.length || 0}<br>Total Quantity: ${totalProduction.toLocaleString()}`;
    
    productionListEl.innerHTML = (productionData || []).map(r => `
      <div style="font-size: 0.85rem; color: #d1d5db; padding: 0.25rem 0; border-bottom: 1px solid #374151;">
        <strong>${r.category}</strong>: ${Number(r.quantity).toLocaleString()} on ${r.record_date}
      </div>
    `).join('');
  }

  // Sales data
  const { data: salesData } = await supabase
    .from('sales')
    .select('sale_date, product_type, quantity, total_amount, customer_name')
    .order('created_at', { ascending: false })
    .limit(5);

  const salesSummaryEl = document.getElementById('salesSummary');
  const salesListEl = document.getElementById('salesList');
  
  if (salesSummaryEl && salesListEl) {
    const totalSalesAmount = (salesData || []).reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
    salesSummaryEl.innerHTML = `Total Sales: ${salesData?.length || 0}<br>Total Revenue: KES ${totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    
    salesListEl.innerHTML = (salesData || []).map(r => `
      <div style="font-size: 0.85rem; color: #d1d5db; padding: 0.25rem 0; border-bottom: 1px solid #374151;">
        <strong>${r.product_type}</strong>: KES ${Number(r.total_amount).toLocaleString()} (${r.customer_name || 'No customer'})
      </div>
    `).join('');
  }

  // Expenses data
  const { data: expensesData } = await supabase
    .from('expenses')
    .select('expense_date, expense_type, amount, description')
    .order('created_at', { ascending: false })
    .limit(5);

  const expensesSummaryEl = document.getElementById('expensesSummary');
  const expensesListEl = document.getElementById('expensesList');
  
  if (expensesSummaryEl && expensesListEl) {
    const totalExpensesAmount = (expensesData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
    expensesSummaryEl.innerHTML = `Total Expenses: ${expensesData?.length || 0}<br>Total Amount: KES ${totalExpensesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    
    expensesListEl.innerHTML = (expensesData || []).map(r => `
      <div style="font-size: 0.85rem; color: #d1d5db; padding: 0.25rem 0; border-bottom: 1px solid #374151;">
        <strong>${r.expense_type}</strong>: KES ${Number(r.amount).toLocaleString()} (${r.description || 'No description'})
      </div>
    `).join('');
  }

  // Materials data
  const { data: materialsUsageData } = await supabase
    .from('materials_usage')
    .select('usage_date, material_type, quantity_used')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: materialsInventoryData } = await supabase
    .from('materials_inventory_bought')
    .select('purchase_date, b_preform, s_preform, big_caps, small_caps, plastic')
    .order('created_at', { ascending: false })
    .limit(3);

  const materialsSummaryEl = document.getElementById('materialsSummary');
  const materialsListEl = document.getElementById('materialsList');
  
  if (materialsSummaryEl && materialsListEl) {
    const totalUsage = (materialsUsageData || []).reduce((sum, r) => sum + Number(r.quantity_used || 0), 0);
    materialsSummaryEl.innerHTML = `Usage Records: ${materialsUsageData?.length || 0}<br>Total Used: ${totalUsage.toLocaleString()}<br>Inventory Purchases: ${materialsInventoryData?.length || 0}`;
    
    const usageItems = (materialsUsageData || []).map(r => `
      <div style="font-size: 0.85rem; color: #d1d5db; padding: 0.25rem 0;">
        Used ${Number(r.quantity_used).toLocaleString()} ${r.material_type} on ${r.usage_date}
      </div>
    `).join('');
    
    const inventoryItems = (materialsInventoryData || []).map(r => `
      <div style="font-size: 0.85rem; color: #9ca3af; padding: 0.25rem 0; margin-top: 0.5rem; border-top: 1px solid #374151;">
        <strong>Purchase ${r.purchase_date}:</strong><br>
        B-preform: ${Number(r.b_preform).toLocaleString()} | S-preform: ${Number(r.s_preform).toLocaleString()}<br>
        Big caps: ${Number(r.big_caps).toLocaleString()} | Small caps: ${Number(r.small_caps).toLocaleString()} | Plastic: ${Number(r.plastic).toLocaleString()}
      </div>
    `).join('');
    
    materialsListEl.innerHTML = usageItems + inventoryItems;
  }
}

async function init() {
  const user = await requireAuth();
  if (!user) return;

  const emailEl = document.getElementById('userEmail');
  if (emailEl) emailEl.textContent = user.email || 'Signed in';

  const sidebarEmailEl = document.getElementById('sidebarUserEmail');
  if (sidebarEmailEl) sidebarEmailEl.textContent = user.email || '';

   // Hide management-only items for non-management roles
  const role = await getCurrentRole();
  const isManagement = role === 'Admin' || role === 'Manager';
  if (!isManagement) {
    document.querySelectorAll('[data-role="management-only"]').forEach((el) => {
      el.style.display = 'none';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut();
      window.location.href = '../index.html';
    });
  }

  await loadDashboardSummary();
}

init();
