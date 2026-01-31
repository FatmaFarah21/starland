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
    .from('materials_usage')
    .select('*')
    .eq('usage_date', todayStr)
    .order('created_at', { ascending: false });

  const listEl = document.getElementById('materialsList');
  const emptyEl = document.getElementById('materialsEmpty');
  const countEl = document.getElementById('materialsCount');

  if (error) {
    console.error('Error loading materials usage', error);
    if (emptyEl) emptyEl.textContent = 'Failed to load usage records.';
    return;
  }

  const rows = data || [];

  if (rows.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (listEl) listEl.innerHTML = '';
    if (countEl) countEl.textContent = '';
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  if (countEl) countEl.textContent = `${rows.length} record(s)`;

  if (listEl) {
    listEl.innerHTML = rows
      .map((row) => {
        const time = new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
            <div>
              <div style="font-weight: 500;">${row.material_type}</div>
              <div style="color: #6b7280;">${time}</div>
            </div>
            <div style="font-weight: 600;">${Number(row.quantity_used).toLocaleString()}</div>
          </div>
        `;
      })
      .join('');
  }
}

const MATERIALS = [
  'B. Preform',
  'S. Preform',
  'Big Caps',
  'Small Caps',
  'Plastic',
];

async function loadInventorySummary() {
  const [boughtRes, usedRes] = await Promise.all([
    supabase
      .from('materials_inventory_bought')
      .select('b_preform, s_preform, big_caps, small_caps, plastic'),
    supabase
      .from('materials_usage')
      .select('material_type, quantity_used'),
  ]);

  const tbody = document.getElementById('inventorySummaryBody');
  if (!tbody) return;

  if (boughtRes.error || usedRes.error) {
    console.error('Error loading inventory summary', {
      boughtError: boughtRes.error,
      usedError: usedRes.error,
    });
    tbody.innerHTML = '';
    return;
  }

  const summary = {};
  MATERIALS.forEach((m) => {
    summary[m] = { opening: 0, added: 0, used: 0 };
  });

  (boughtRes.data || []).forEach((row) => {
    summary['B. Preform'].added += Number(row.b_preform || 0);
    summary['S. Preform'].added += Number(row.s_preform || 0);
    summary['Big Caps'].added += Number(row.big_caps || 0);
    summary['Small Caps'].added += Number(row.small_caps || 0);
    summary['Plastic'].added += Number(row.plastic || 0);
  });

  (usedRes.data || []).forEach((row) => {
    if (!summary[row.material_type]) return;
    summary[row.material_type].used += Number(row.quantity_used || 0);
  });

  const rowsHtml = MATERIALS.map((name) => {
    const s = summary[name];
    const expected = s.added - s.used;
    const slug = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `
      <tr>
        <td style="padding: 0.25rem 0.25rem;">${name}</td>
        <td style="padding: 0.25rem 0.25rem; text-align: right;">${s.opening.toLocaleString()}</td>
        <td style="padding: 0.25rem 0.25rem; text-align: right;">${s.added.toLocaleString()}</td>
        <td style="padding: 0.25rem 0.25rem; text-align: right;">${s.used.toLocaleString()}</td>
        <td style="padding: 0.25rem 0.25rem; text-align: right;">${expected.toLocaleString()}</td>
        <td style="padding: 0.25rem 0.25rem; text-align: right;">
          <input type="number" data-material="${slug}" data-expected="${expected.toFixed(2)}" style="width: 80px; padding: 0.2rem 0.25rem; border-radius: 0.35rem; border: 1px solid #374151; background: #020617; color: #e5e7eb; font-size: 0.8rem;">
        </td>
        <td style="padding: 0.25rem 0.25rem; text-align: right;" id="variance_${slug}">0.00</td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rowsHtml;

  Array.from(tbody.querySelectorAll('input[data-material]')).forEach((input) => {
    input.addEventListener('input', () => {
      const expected = parseFloat(input.dataset.expected || '0');
      const actual = parseFloat(input.value || '0');
      const variance = actual - expected;
      const target = document.getElementById(`variance_${input.dataset.material}`);
      if (target) target.textContent = variance.toFixed(2);
    });
  });
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

  const dateInput = document.getElementById('usage_date');
  if (dateInput) {
    dateInput.value = formatDateInput(new Date());
  }

  const form = document.getElementById('materialsForm');
  const errorEl = document.getElementById('materialsError');
  const saveBtn = document.getElementById('saveUsageBtn');
  const inventoryForm = document.getElementById('inventoryForm');
  const inventoryError = document.getElementById('inventoryError');
  const purchaseDateInput = document.getElementById('purchase_date');

  if (purchaseDateInput) {
    purchaseDateInput.value = formatDateInput(new Date());
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) errorEl.classList.add('hidden');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      const usage_date = dateInput.value;
      const material_type = document.getElementById('material_type').value;
      const quantity_used = parseFloat(document.getElementById('quantity_used').value || '0');

      try {
        if (!usage_date || !material_type || Number.isNaN(quantity_used)) {
          throw new Error('Please fill all required fields.');
        }

        const { error } = await supabase.from('materials_usage').insert({
          usage_date,
          material_type,
          quantity_used,
          created_by: user.id,
        });

        if (error) {
          throw error;
        }

        form.reset();
        if (dateInput) dateInput.value = formatDateInput(new Date());
        await loadToday();
        await loadInventorySummary();
      } catch (err) {
        console.error('Error saving materials usage', err);
        if (errorEl) {
          errorEl.textContent = err.message || 'Failed to save usage.';
          errorEl.classList.remove('hidden');
        }
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Submit Usage';
        }
      }
    });
  }

  if (inventoryForm) {
    inventoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (inventoryError) inventoryError.classList.add('hidden');
      if (saveBtn) {
        saveBtn.disabled = true;
      }

      const purchase_date = purchaseDateInput.value;
      const vendor_name = document.getElementById('vendor_name').value.trim();
      const b_preform = parseFloat(document.getElementById('b_preform').value || '0');
      const s_preform = parseFloat(document.getElementById('s_preform').value || '0');
      const big_caps = parseFloat(document.getElementById('big_caps').value || '0');
      const small_caps = parseFloat(document.getElementById('small_caps').value || '0');
      const plastic = parseFloat(document.getElementById('plastic_qty').value || '0');
      const total_cost = parseFloat(document.getElementById('total_cost').value || '0') || null;

      try {
        if (!purchase_date || !vendor_name) {
          throw new Error('Please fill purchase date and vendor name.');
        }

        const { error } = await supabase.from('materials_inventory_bought').insert({
          purchase_date,
          vendor_name,
          b_preform,
          s_preform,
          big_caps,
          small_caps,
          plastic,
          total_cost,
          created_by: user.id,
        });

        if (error) throw error;

        inventoryForm.reset();
        if (purchaseDateInput) purchaseDateInput.value = formatDateInput(new Date());
        await loadInventorySummary();
      } catch (err) {
        console.error('Error saving inventory purchase', err);
        if (inventoryError) {
          inventoryError.textContent = err.message || 'Failed to save inventory purchase.';
          inventoryError.classList.remove('hidden');
        }
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Submit Usage';
        }
      }
    });
  }

  await loadToday();
  await loadInventorySummary();
}

init();
