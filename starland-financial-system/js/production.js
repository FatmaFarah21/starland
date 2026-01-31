import { supabase } from './config.js';
import { requireAuth, signOut, getCurrentRole } from './auth.js';

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadToday(user) {
  const today = new Date();
  const todayStr = formatDateInput(today);

  const { data, error } = await supabase
    .from('production_records')
    .select('*')
    .eq('record_date', todayStr)
    .order('created_at', { ascending: false });

  const metricEl = document.getElementById('metricTodayTotal');
  const logsList = document.getElementById('logsList');
  const logsEmpty = document.getElementById('logsEmpty');
  const logsCount = document.getElementById('logsCount');

  if (error) {
    console.error('Error loading production', error);
    if (metricEl) metricEl.textContent = 'Error';
    if (logsEmpty) logsEmpty.textContent = 'Failed to load records.';
    return;
  }

  const total = (data || []).reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  if (metricEl) metricEl.textContent = `${total.toLocaleString()} units`;

  if (!data || data.length === 0) {
    if (logsEmpty) logsEmpty.classList.remove('hidden');
    if (logsList) logsList.innerHTML = '';
    if (logsCount) logsCount.textContent = '';
    return;
  }

  if (logsEmpty) logsEmpty.classList.add('hidden');
  if (logsCount) logsCount.textContent = `${data.length} record(s)`;

  if (logsList) {
    logsList.innerHTML = data
      .map((row) => {
        const time = new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
            <div>
              <div style="font-weight: 500;">${row.category}</div>
              <div style="color: #6b7280;">${time}</div>
            </div>
            <div style="font-weight: 600;">${Number(row.quantity).toLocaleString()}</div>
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

  const form = document.getElementById('productionForm');
  const formError = document.getElementById('formError');
  const saveBtn = document.getElementById('saveBtn');
  const dateInput = document.getElementById('record_date');

  if (dateInput) {
    dateInput.value = formatDateInput(new Date());
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formError) formError.classList.add('hidden');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      const recordDate = dateInput.value;
      const category = document.getElementById('category').value;
      const quantity = parseFloat(document.getElementById('quantity').value || '0');
      const notes = document.getElementById('notes').value || null;

      try {
        if (!recordDate || !category || Number.isNaN(quantity)) {
          throw new Error('Please fill all required fields.');
        }

        const { error } = await supabase.from('production_records').insert({
          record_date: recordDate,
          category,
          quantity,
          notes,
          created_by: user.id,
        });

        if (error) {
          throw error;
        }

        form.reset();
        if (dateInput) {
          dateInput.value = formatDateInput(new Date());
        }
        await loadToday(user);
      } catch (err) {
        console.error('Error saving production record', err);
        if (formError) {
          formError.textContent = err.message || 'Failed to save record.';
          formError.classList.remove('hidden');
        }
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Record';
        }
      }
    });
  }

  await loadToday(user);
}

init();
