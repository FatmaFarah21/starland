import { requireAuth, signOut, getCurrentRole } from './auth.js';

// Frontend-only reports module - no backend

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadReports() {
  const salesMetric = document.getElementById('metricSales30');
  const expensesMetric = document.getElementById('metricExpenses30');
  const netMetric = document.getElementById('metricNet30');
  const debtorsList = document.getElementById('debtorsList');

  console.log('Frontend skeleton: Loading reports');

  if (salesMetric) salesMetric.textContent = 'KES 0';
  if (expensesMetric) expensesMetric.textContent = 'KES 0';
  if (netMetric) netMetric.textContent = 'KES 0';

  if (debtorsList) {
    debtorsList.innerHTML = `
      <div class="text-center py-8 text-slate-500">
        <span class="material-symbols-outlined text-4xl">description</span>
        <p class="mt-2">Frontend skeleton - no data persistence</p>
        <p class="text-sm">Connect to backend to enable reports</p>
      </div>
    `;
  }
}

async function loadManagementReports() {
  const metricsContainer = document.getElementById('reportsMetrics');
  const chartsContainer = document.getElementById('reportsCharts');

  console.log('Frontend skeleton: Loading management reports');

  if (metricsContainer) {
    metricsContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
          <p class="text-sm text-slate-600 dark:text-slate-400">Total Sales</p>
          <p class="text-2xl font-bold">KES 0</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
          <p class="text-sm text-slate-600 dark:text-slate-400">Total Expenses</p>
          <p class="text-2xl font-bold">KES 0</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
          <p class="text-sm text-slate-600 dark:text-slate-400">Net Profit</p>
          <p class="text-2xl font-bold">KES 0</p>
        </div>
      </div>
    `;
  }

  if (chartsContainer) {
    chartsContainer.innerHTML = `
      <div class="text-center py-12 text-slate-500">
        <span class="material-symbols-outlined text-6xl">bar_chart</span>
        <p class="mt-4">Charts not available in frontend skeleton</p>
        <p class="text-sm">Connect to backend to enable data visualization</p>
      </div>
    `;
  }
}

async function exportReport(format) {
  console.log('Frontend skeleton: Export report requested', { format });
  alert(`Export ${format} - Frontend skeleton mode (no data)`);
}

async function initReportsPage() {
  try {
    await requireAuth();
    const role = await getCurrentRole();

    if (role === 'management') {
      await loadManagementReports();
    } else {
      await loadReports();
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        await exportReport('PDF');
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await signOut();
        window.location.href = '../index.html';
      });
    }
  } catch (error) {
    console.error('Reports page error:', error);
  }
}

window.loadReports = loadReports;
window.exportReport = exportReport;
document.addEventListener('DOMContentLoaded', initReportsPage);
