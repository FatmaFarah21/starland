import { supabase } from './config.js';
import { requireAuth, signOut, getCurrentRole } from './auth.js';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function recalcTotals() {
  const qty = parseFloat(document.getElementById('quantity').value || '0');
  const price = parseFloat(document.getElementById('unit_price').value || '0');
  const paid = parseFloat(document.getElementById('amount_paid').value || '0');

  const total = qty * price;
  const outstanding = Math.max(total - paid, 0);

  const totalInput = document.getElementById('total_amount');
  const outstandingInput = document.getElementById('outstanding_balance');

  if (totalInput) totalInput.value = total.toFixed(2);
  if (outstandingInput) outstandingInput.value = outstanding.toFixed(2);
}

function statusFromSale(row) {
  const total = Number(row.total_amount || 0);
  const outstanding = Number(row.outstanding_balance || 0);
  if (outstanding <= 0.001) return { label: 'PAID', color: '#22c55e' };
  const today = new Date();
  const saleDate = new Date(row.sale_date);
  if (saleDate < new Date(today.toDateString())) {
    return { label: 'OVERDUE', color: '#f97316' };
  }
  return { label: 'PENDING', color: '#eab308' };
}

async function loadToday() {
  const todayStr = formatDateInput(new Date());

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('sale_date', todayStr)
    .order('created_at', { ascending: false });

  const metricSales = document.getElementById('metricSalesToday');
  const metricPending = document.getElementById('metricPendingBalance');
  const listEl = document.getElementById('salesList');
  const emptyEl = document.getElementById('salesEmpty');
  const countEl = document.getElementById('salesCount');

  if (error) {
    console.error('Error loading sales', error);
    if (metricSales) metricSales.textContent = 'Error';
    if (metricPending) metricPending.textContent = 'Error';
    if (emptyEl) emptyEl.textContent = 'Failed to load sales.';
    return;
  }

  const rows = data || [];
  const totalSales = rows.reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
  const totalPending = rows.reduce((sum, r) => sum + Number(r.outstanding_balance || 0), 0);

  if (metricSales) metricSales.textContent = `KES ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  if (metricPending) metricPending.textContent = `KES ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  if (rows.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (listEl) listEl.innerHTML = '';
    if (countEl) countEl.textContent = '';
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  if (countEl) countEl.textContent = `${rows.length} sale(s)`;

  if (listEl) {
    listEl.innerHTML = rows
      .map((row) => {
        const time = new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const status = statusFromSale(row);
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
            <div>
              <div style="font-weight: 500;">#${row.receipt_no} - ${row.product_type}</div>
              <div style="color: #6b7280;">${time}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 600;">KES ${Number(row.total_amount).toLocaleString()}</div>
              <div style="margin-top: 2px; font-size: 0.75rem;">
                <span style="padding: 2px 6px; border-radius: 999px; background: ${status.color}22; color: ${status.color};">${status.label}</span>
              </div>
            </div>
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

  const saleDateInput = document.getElementById('sale_date');
  if (saleDateInput) {
    saleDateInput.value = formatDateInput(new Date());
  }

  ['quantity', 'unit_price', 'amount_paid'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', recalcTotals);
    }
  });

  const form = document.getElementById('salesForm');
  const errorEl = document.getElementById('salesError');
  const saveBtn = document.getElementById('saveSaleBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) errorEl.classList.add('hidden');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      const receipt_no = document.getElementById('receipt_no').value.trim();
      const sale_date = saleDateInput.value;
      const product_type = document.getElementById('product_type').value;
      const quantity = parseFloat(document.getElementById('quantity').value || '0');
      const unit_price = parseFloat(document.getElementById('unit_price').value || '0');
      const total_amount = parseFloat(document.getElementById('total_amount').value || '0');
      const payment_method = document.getElementById('payment_method').value;
      const amount_paid = parseFloat(document.getElementById('amount_paid').value || '0');
      const outstanding_balance = parseFloat(document.getElementById('outstanding_balance').value || '0');
      const customer_name = document.getElementById('customer_name').value || null;
      const notes = document.getElementById('notes').value || null;

      try {
        if (!receipt_no || !sale_date || !product_type || Number.isNaN(quantity) || Number.isNaN(unit_price)) {
          throw new Error('Please fill all required fields.');
        }

        const { error } = await supabase.from('sales').insert({
          receipt_no,
          sale_date,
          product_type,
          quantity,
          unit_price,
          total_amount,
          payment_method,
          amount_paid,
          outstanding_balance,
          customer_name,
          notes,
          created_by: user.id,
        });

        if (error) {
          throw error;
        }

        form.reset();
        if (saleDateInput) saleDateInput.value = formatDateInput(new Date());
        recalcTotals();
        await loadToday();
      } catch (err) {
        console.error('Error saving sale', err);
        if (errorEl) {
          errorEl.textContent = err.message || 'Failed to save sale.';
          errorEl.classList.remove('hidden');
        }
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Record Sale Entry';
        }
      }
    });
  }

  recalcTotals();
  await loadToday();
}

init();
