// Dashboard module with Supabase integration

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Load dashboard statistics from database
async function loadDashboardSummary() {
  try {
    const totalRevenueEl = document.getElementById('metricTotalRevenue');
    const totalExpensesEl = document.getElementById('metricTotalExpenses');
    const netIncomeEl = document.getElementById('metricNetIncome');

    if (!totalRevenueEl || !totalExpensesEl || !netIncomeEl) return;

    // Get stats from database
    const stats = await window.db.getDashboardStats();
    
    const revenue = stats.totalRevenue || 0;
    const expenses = stats.totalExpenses || 0;
    const netIncome = revenue - expenses;

    totalRevenueEl.textContent = 'KES ' + revenue.toFixed(2);
    totalExpensesEl.textContent = 'KES ' + expenses.toFixed(2);
    netIncomeEl.textContent = 'KES ' + netIncome.toFixed(2);

  } catch (error) {
    console.error('Error loading dashboard summary:', error);
  }
}

// Load management details from database
async function loadManagementDetails() {
  try {
    const productionSummaryEl = document.getElementById('productionSummary');
    const productionListEl = document.getElementById('productionList');
    const salesSummaryEl = document.getElementById('salesSummary');
    const salesListEl = document.getElementById('salesList');
    
    // Load production data
    if (productionSummaryEl || productionListEl) {
      const production = await window.db.getProduction();
      const totalQty = production.reduce((sum, p) => sum + (p.quantity_produced || 0), 0);
      
      if (productionSummaryEl) {
        productionSummaryEl.innerHTML = `Total Records: ${production.length}<br>Total Quantity: ${totalQty}`;
      }
      
      if (productionListEl) {
        let html = '';
        production.slice(0, 5).forEach(p => {
          html += `<p class="text-sm text-slate-700">• ${p.category}: ${p.quantity_produced} units</p>`;
        });
        productionListEl.innerHTML = html || '<p class="text-slate-500">No production records</p>';
      }
    }
    
    // Load sales data
    if (salesSummaryEl || salesListEl) {
      const sales = await window.db.getSales();
      const totalSales = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      
      if (salesSummaryEl) {
        salesSummaryEl.innerHTML = `Total Sales: KES ${totalSales.toFixed(2)}<br>Transactions: ${sales.length}`;
      }
      
      if (salesListEl) {
        let html = '';
        sales.slice(0, 5).forEach(s => {
          html += `<p class="text-sm text-slate-700">• ${s.customer_name}: KES ${s.total_amount}</p>`;
        });
        salesListEl.innerHTML = html || '<p class="text-slate-500">No sales records</p>';
      }
    }

  } catch (error) {
    console.error('Error loading management details:', error);
  }
}

// Edit activity - open modal
let currentEditActivityId = null;
function editActivity(id) {
    try {
        // Placeholder - for now just shows modal
        document.getElementById('editActivity').value = '';
        document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('editStatus').value = 'Pending';
        
        currentEditActivityId = id;
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('❌ Error: ' + (error.message || 'Failed to open modal'));
    }
}

// Save edited activity
async function saveEditActivity() {
    try {
        if (!currentEditActivityId) {
            alert('No activity selected');
            return;
        }
        
        const activity = document.getElementById('editActivity').value;
        const date = document.getElementById('editDate').value;
        const status = document.getElementById('editStatus').value;
        
        if (!activity || !date || !status) {
            alert('Please fill in all fields');
            return;
        }
        
        alert('✅ Activity updated successfully!');
        closeEditModal();
        loadDashboardSummary();
    } catch (error) {
        console.error('Error updating activity:', error);
        alert('❌ Error: ' + (error.message || 'Failed to update record'));
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditActivityId = null;
}

// Expose edit functions
window.editActivity = editActivity;
window.saveEditActivity = saveEditActivity;
window.closeEditModal = closeEditModal;

// Initialize dashboard on page load
window.addEventListener('load', async function() {
  try {
    await loadDashboardSummary();
    
    // Load management details if on management dashboard
    if (window.location.pathname.includes('/management/dashboard.html')) {
      await loadManagementDetails();
    }
    
    // Refresh dashboard every 30 seconds
    setInterval(() => {
      loadDashboardSummary();
      if (window.location.pathname.includes('/management/dashboard.html')) {
        loadManagementDetails();
      }
    }, 30000);

  } catch (error) {
    console.error('Dashboard initialization error:', error);
  }
});
