import { supabase } from './config.js';
import { requireAuth, signOut, getCurrentRole } from './auth.js';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadReports() {
  const today = new Date();
  const from = new Date();
  from.setDate(today.getDate() - 30);
  const fromStr = formatDateInput(from);

  const [
    { data: salesRows, error: salesError },
    { data: expenseRows, error: expensesError },
    { data: debtRows, error: debtError },
  ] = await Promise.all([
    supabase
      .from('sales')
      .select('total_amount')
      .gte('sale_date', fromStr),
    supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', fromStr),
    supabase
      .from('sales')
      .select('receipt_no, customer_name, total_amount, outstanding_balance, sale_date')
      .gt('outstanding_balance', 0),
  ]);

  const salesMetric = document.getElementById('metricSales30');
  const expensesMetric = document.getElementById('metricExpenses30');
  const netMetric = document.getElementById('metricNet30');
  const debtorsList = document.getElementById('debtorsList');
  const debtorsEmpty = document.getElementById('debtorsEmpty');

  if (salesError || expensesError) {
    console.error('Error loading reports', { salesError, expensesError });
    if (salesMetric) salesMetric.textContent = 'Error';
    if (expensesMetric) expensesMetric.textContent = 'Error';
    if (netMetric) netMetric.textContent = 'Error';
    return;
  }

  const totalSales = (salesRows || []).reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
  const totalExpenses = (expenseRows || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const net = totalSales - totalExpenses;

  if (salesMetric) salesMetric.textContent = `KES ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  if (expensesMetric) expensesMetric.textContent = `KES ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  if (netMetric) netMetric.textContent = `KES ${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  if (debtError) {
    console.error('Error loading debtors', debtError);
    if (debtorsEmpty) debtorsEmpty.textContent = 'Failed to load debtors.';
    return;
  }

  if (!debtorsList || !debtorsEmpty) return;

  const debts = debtRows || [];
  if (debts.length === 0) {
    debtorsEmpty.classList.remove('hidden');
    debtorsList.innerHTML = '';
    return;
  }

  debtorsEmpty.classList.add('hidden');
  debtorsList.innerHTML = debts
    .map((row) => {
      const saleDate = new Date(row.sale_date);
      const days = Math.max(
        0,
        Math.round((today - saleDate) / (1000 * 60 * 60 * 24)),
      );
      const customer = row.customer_name || 'Walk-in customer';
      const outstanding = Number(row.outstanding_balance || 0);
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
          <div>
            <div style="font-weight: 500;">#${row.receipt_no} - ${customer}</div>
            <div style="color: #6b7280;">${saleDate.toLocaleDateString()} • ${days} day(s) outstanding</div>
          </div>
          <div style="font-weight: 600;">KES ${outstanding.toLocaleString()}</div>
        </div>
      `;
    })
    .join('');
}

async function init() {
  const user = await requireAuth();
  if (!user) return;

  const role = await getCurrentRole();
  const isManagement = role === 'Admin' || role === 'Manager';
  if (!isManagement) {
    document.querySelectorAll('[data-role="management-only"]').forEach((el) => {
      el.style.display = 'none';
    });
    window.location.href = './dashboard.html';
    return;
  }

  const emailEl = document.getElementById('userEmail');
  if (emailEl) emailEl.textContent = user.email || 'Signed in';
  const sidebarEmailEl = document.getElementById('sidebarUserEmail');
  if (sidebarEmailEl) sidebarEmailEl.textContent = user.email || '';

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut();
      window.location.href = '../index.html';
    });
  }

  await loadReports();
}

init();
