import { supabase } from './config.js';
import { requireAuth, signOut, getCurrentRole } from './auth.js';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadToday() {
  const todayStr = formatDateInput(new Date());

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('expense_date', todayStr)
    .order('created_at', { ascending: false });

  const metricEl = document.getElementById('metricExpensesToday');
  const listEl = document.getElementById('expensesList');
  const emptyEl = document.getElementById('expensesEmpty');
  const countEl = document.getElementById('expensesCount');

  if (error) {
    console.error('Error loading expenses', error);
    if (metricEl) metricEl.textContent = 'Error';
    if (emptyEl) emptyEl.textContent = 'Failed to load expenses.';
    return;
  }

  const rows = data || [];
  const total = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  if (metricEl) metricEl.textContent = `KES ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  if (rows.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (listEl) listEl.innerHTML = '';
    if (countEl) countEl.textContent = '';
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  if (countEl) countEl.textContent = `${rows.length} expense(s)`;

  if (listEl) {
    listEl.innerHTML = rows
      .map((row) => {
        const time = new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
            <div>
              <div style="font-weight: 500;">${row.expense_type}</div>
              <div style="color: #6b7280;">${time}</div>
            </div>
            <div style="font-weight: 600;">KES ${Number(row.amount).toLocaleString()}</div>
          </div>
        `;
      })
      .join('');
  }
}

async function init() {
  const user = await requireAuth();
  if (!user) return;

  const emailEl = document.getElementById('userEmail');
  if (emailEl) emailEl.textContent = user.email || 'Signed in';
  const sidebarEmailEl = document.getElementById('sidebarUserEmail');
  if (sidebarEmailEl) sidebarEmailEl.textContent = user.email || '';

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

  const dateInput = document.getElementById('expense_date');
  if (dateInput) {
    dateInput.value = formatDateInput(new Date());
  }

  const form = document.getElementById('expensesForm');
  const errorEl = document.getElementById('expensesError');
  const saveBtn = document.getElementById('saveExpenseBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) errorEl.classList.add('hidden');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      const expense_date = dateInput.value;
      const expense_type = document.getElementById('expense_type').value.trim();
      const description = document.getElementById('description').value || null;
      const amount = parseFloat(document.getElementById('amount').value || '0');
      const payment_method = document.getElementById('payment_method').value.trim();

      try {
        if (!expense_date || !expense_type || !payment_method || Number.isNaN(amount)) {
          throw new Error('Please fill all required fields.');
        }

        const { error } = await supabase.from('expenses').insert({
          expense_date,
          expense_type,
          description,
          amount,
          payment_method,
          created_by: user.id,
        });

        if (error) {
          throw error;
        }

        form.reset();
        if (dateInput) dateInput.value = formatDateInput(new Date());
        await loadToday();
      } catch (err) {
        console.error('Error saving expense', err);
        if (errorEl) {
          errorEl.textContent = err.message || 'Failed to save expense.';
          errorEl.classList.remove('hidden');
        }
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Expense';
        }
      }
    });
  }

  await loadToday();
}

init();
