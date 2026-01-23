// Dashboard Logic for Starland Water Company System
// Handles dashboard functionality, charts, and data visualization

document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/management/dashboard.html')) {
    initializeDashboard();
  } else if (currentPath.includes('/management/sales.html')) {
    initializeSalesDashboard();
  } else if (currentPath.includes('/management/expenses.html')) {
    initializeExpensesDashboard();
  } else if (currentPath.includes('/management/diesel.html')) {
    initializeDieselDashboard();
  } else if (currentPath.includes('/management/repairs.html')) {
    initializeRepairsDashboard();
  } else if (currentPath.includes('/management/damages.html')) {
    initializeDamagesDashboard();
  } else if (currentPath.includes('/management/reports.html')) {
    initializeReportsPage();
  }
  
  // Initialize event listeners for user management
  if (document.getElementById('addUserFormElement')) {
    document.getElementById('addUserFormElement').addEventListener('submit', function(e) {
      e.preventDefault();
      saveUser();
    });
  }
});

// Initialize main dashboard
function initializeDashboard() {
  // Load dashboard data
  loadDashboardData();
  
  // Set up date range selector
  setupDateRangeSelector();
  
  // Initialize any charts (would integrate with Chart.js or similar in real app)
  initializeCharts();
}

// Load dashboard data from Supabase database
async function loadDashboardData() {
  try {
    // In a real application, this would fetch from Supabase
    // Example implementation:
    // const { data: salesEntries, error: salesError } = await window.supabaseClient.from('sales_transactions').select('*');
    // const { data: expenseEntries, error: expenseError } = await window.supabaseClient.from('expense_transactions').select('*');
    // const { data: dieselEntries, error: dieselError } = await window.supabaseClient.from('diesel_transactions').select('*');
    // const { data: repairEntries, error: repairError } = await window.supabaseClient.from('repair_transactions').select('*');
    // const { data: damageEntries, error: damageError } = await window.supabaseClient.from('damage_transactions').select('*');
    // 
    // if (salesError || expenseError || dieselError || repairError || damageError) {
    //   console.error('Error fetching data from Supabase:', salesError || expenseError || dieselError || repairError || damageError);
    //   throw new Error('Failed to load data from database');
    // }
    
    // Fetch data from Supabase database
    const salesResult = await window.supabaseClient.from('sales_transactions').select('*');
    const expenseResult = await window.supabaseClient.from('expense_transactions').select('*');
    const dieselResult = await window.supabaseClient.from('diesel_transactions').select('*');
    const repairResult = await window.supabaseClient.from('repair_transactions').select('*');
    const damageResult = await window.supabaseClient.from('damage_transactions').select('*');
    
    // Check for errors
    if (salesResult.error) console.error('Sales fetch error:', salesResult.error);
    if (expenseResult.error) console.error('Expense fetch error:', expenseResult.error);
    if (dieselResult.error) console.error('Diesel fetch error:', dieselResult.error);
    if (repairResult.error) console.error('Repair fetch error:', repairResult.error);
    if (damageResult.error) console.error('Damage fetch error:', damageResult.error);
    
    // Use fetched data or fallback to localStorage if Supabase fails
    const salesEntries = salesResult.data || (localStorage.getItem('salesEntries') ? JSON.parse(localStorage.getItem('salesEntries')) : []) || generateSampleSalesData();
    const expenseEntries = expenseResult.data || (localStorage.getItem('expenseEntries') ? JSON.parse(localStorage.getItem('expenseEntries')) : []) || generateSampleExpenseData();
    const dieselEntries = dieselResult.data || (localStorage.getItem('dieselEntries') ? JSON.parse(localStorage.getItem('dieselEntries')) : []);
    const repairEntries = repairResult.data || (localStorage.getItem('repairEntries') ? JSON.parse(localStorage.getItem('repairEntries')) : []);
    const damageEntries = damageResult.data || (localStorage.getItem('damageEntries') ? JSON.parse(localStorage.getItem('damageEntries')) : []);
    
    // Calculate KPIs
    const today = new Date().toISOString().split('T')[0];
    const todaySales = salesEntries.filter(entry => entry.date === today);
    const month = new Date().toISOString().split('-')[1];
    const monthSales = salesEntries.filter(entry => entry.date.split('-')[1] === month);
    const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const netProfit = monthSales.reduce((sum, entry) => sum + entry.total_amount, 0) - totalExpenses;
    
    // Update KPI cards
    document.querySelector('.kpi-value:nth-of-type(1)').textContent = `KSH ${calculateTotal(todaySales, 'total_amount').toLocaleString()}`;
    document.querySelector('.kpi-value:nth-of-type(2)').textContent = `KSH ${calculateTotal(monthSales, 'total_amount').toLocaleString()}`;
    document.querySelector('.kpi-value:nth-of-type(3)').textContent = `KSH ${totalExpenses.toLocaleString()}`;
    document.querySelector('.kpi-value:nth-of-type(4)').textContent = `KSH ${netProfit.toLocaleString()}`;
    
    // Update recent activity table with ALL entries
    updateRecentActivityTable([...salesEntries, ...expenseEntries, ...dieselEntries, ...repairEntries, ...damageEntries]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Show empty table if no data
    updateRecentActivityTable([]);
  }
}

// Calculate total for a specific property
function calculateTotal(entries, property) {
  return entries.reduce((sum, entry) => sum + (entry[property] || 0), 0);
}

// Update recent activity table
function updateRecentActivityTable(allEntries) {
  // Sort by date (most recent first) and take top 5
  const sortedEntries = [...allEntries]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  sortedEntries.forEach(entry => {
    const row = document.createElement('tr');
    
    // Determine type and amount based on entry
    let type = 'Transaction';
    let amount = 'N/A';
    let description = 'General Transaction';
    
    if (entry.receipt_number) {
      // Sales entry
      type = 'Sale';
      amount = `KSH ${entry.total_amount?.toLocaleString()}`;
      description = `Sale to ${entry.customer_name}`;
    } else if (entry.expense_number) {
      // Expense entry
      type = 'Expense';
      amount = `KSH ${entry.amount?.toLocaleString()}`;
      description = entry.description;
    } else if (entry.transaction_number) {
      // Diesel entry
      type = 'Diesel';
      amount = `KSH ${entry.total_cost?.toLocaleString()}`;
      description = `Diesel purchase - ${entry.liters}L from ${entry.supplier}`;
    } else if (entry.repair_number) {
      // Repair entry
      type = 'Repair';
      amount = `KSH ${entry.cost?.toLocaleString()}`;
      description = `Repair for ${entry.equipment}`;
    } else if (entry.damage_number) {
      // Damage entry
      type = 'Damage';
      amount = `KSH ${entry.estimated_value?.toLocaleString()}`;
      description = `Damage to ${entry.item_name}`;
    }
    
    row.innerHTML = `
      <td>${formatDate(entry.date)}</td>
      <td>${type}</td>
      <td>${description}</td>
      <td>${amount}</td>
      <td>${entry.created_by_name || entry.created_by || 'Unknown'}</td>
      <td><span class="status success">Completed</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Initialize charts (placeholder for actual chart implementation)
function initializeCharts() {
  // In a real app, this would initialize Chart.js or similar library
  // For demo, we'll just update the placeholders with sample data
  
  const salesChartPlaceholder = document.querySelector('.chart-placeholder:first-of-type');
  if (salesChartPlaceholder) {
    salesChartPlaceholder.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
        <h4 style="margin-bottom: 1rem; color: #1e3a8a;">Sales Trend Visualization</h4>
        <div style="display:flex; align-items:end; height:150px; width:100%; justify-content:space-around;">
          <div style="width:20px; background:#3b82f6; height:30%;">&nbsp;</div>
          <div style="width:20px; background:#3b82f6; height:50%;">&nbsp;</div>
          <div style="width:20px; background:#3b82f6; height:70%;">&nbsp;</div>
          <div style="width:20px; background:#3b82f6; height:60%;">&nbsp;</div>
          <div style="width:20px; background:#3b82f6; height:80%;">&nbsp;</div>
          <div style="width:20px; background:#3b82f6; height:90%;">&nbsp;</div>
          <div style="width:20px; background:#3b82f6; height:75%;">&nbsp;</div>
        </div>
      </div>
    `;
  }
  
  const expenseChartPlaceholder = document.querySelectorAll('.chart-placeholder')[1];
  if (expenseChartPlaceholder) {
    expenseChartPlaceholder.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
        <h4 style="margin-bottom: 1rem; color: #1e3a8a;">Expense Breakdown</h4>
        <div style="display:flex; justify-content:center; align-items:center; height:150px;">
          <div style="display:flex;">
            <div style="width:50px; height:50px; background:#3b82f6; border-radius:50%; margin-right:10px;"></div>
            <div style="width:50px; height:50px; background:#10b981; border-radius:50%; margin-right:10px;"></div>
            <div style="width:50px; height:50px; background:#f59e0b; border-radius:50%;"></div>
          </div>
        </div>
        <div style="display:flex; justify-content:center; margin-top:10px;">
          <div style="margin-right:20px;"><span style="color:#3b82f6;">●</span> Operations</div>
          <div style="margin-right:20px;"><span style="color:#10b981;">●</span> Personnel</div>
          <div style="margin-right:20px;"><span style="color:#f59e0b;">●</span> Other</div>
        </div>
      </div>
    `;
  }
}

// Set up date range selector
function setupDateRangeSelector() {
  const selector = document.querySelector('.date-range-selector');
  if (selector) {
    selector.addEventListener('change', function() {
      // Reload dashboard data based on selected date range
      loadDashboardData();
      initializeCharts();
    });
  }
}

// Initialize sales dashboard
function initializeSalesDashboard() {
  loadSalesData();
  setupDateRangeSelector();
  setupSalesFilters();
}

// Load sales data for sales management page
async function loadSalesData() {
  // Get sales data from Supabase database with fallback to localStorage
  const { data, error } = await window.supabaseClient.from('sales_transactions').select('*');
  
  if (error) {
    console.error('Error fetching sales data from Supabase:', error);
  }
  
  const salesEntries = data || JSON.parse(localStorage.getItem('salesEntries') || '[]') || generateSampleSalesData();
  
  // Calculate summary stats
  const totalSales = calculateTotal(salesEntries, 'total_amount');
  const transactionCount = salesEntries.length;
  const avgTransactionValue = transactionCount > 0 ? totalSales / transactionCount : 0;
  
  // Update summary stats
  document.querySelectorAll('.stat-value').forEach((el, index) => {
    switch(index) {
      case 0:
        el.textContent = `KSH ${totalSales.toLocaleString()}`;
        break;
      case 1:
        el.textContent = transactionCount;
        break;
      case 2:
        el.textContent = `KSH ${avgTransactionValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        break;
    }
  });
  
  // Update sales table
  updateSalesTable(salesEntries);
}

// Update sales table with data
function updateSalesTable(salesEntries) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Sort by date (most recent first)
  const sortedEntries = [...salesEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedEntries.forEach(entry => {
    const row = document.createElement('tr');
    
    // Format product type for display
    let productDisplay = entry.product_type;
    switch(entry.product_type) {
      case 'drum':
        productDisplay = 'Drum (20L)';
        break;
      case 'jerrycan':
        productDisplay = 'Jerry Can (5L)';
        break;
      case 'small_bottle':
        productDisplay = 'Small Bottle (1L)';
        break;
    }
    
    row.innerHTML = `
      <td>${entry.receipt_number}</td>
      <td>${formatDate(entry.date)}</td>
      <td>${entry.customer_name}</td>
      <td>${productDisplay}</td>
      <td>${entry.quantity}</td>
      <td>${entry.total_amount?.toLocaleString()}</td>
      <td>${entry.payment_method}</td>
      <td>${entry.created_by_name || entry.created_by || 'Unknown'}</td>
      <td><span class="status success">Completed</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Set up sales filters and search
function setupSalesFilters() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      // In a real app, this would filter the sales data
      // For demo, we'll just log the search term
      console.log('Searching for:', this.value);
    });
  }
  
  // Export button functionality
  const exportBtn = document.querySelector('.btn-secondary');
  if (exportBtn && exportBtn.textContent === 'Export') {
    exportBtn.addEventListener('click', function() {
      alert('Export functionality would be implemented here');
    });
  }
}

// Initialize expenses dashboard
function initializeExpensesDashboard() {
  loadExpensesData();
  setupDateRangeSelector();
  setupExpensesFilters();
}

// Load expenses data
async function loadExpensesData() {
  // Get expenses data from Supabase database with fallback to localStorage
  const { data, error } = await window.supabaseClient.from('expense_transactions').select('*');
  
  if (error) {
    console.error('Error fetching expense data from Supabase:', error);
  }
  
  const expenseEntries = data || JSON.parse(localStorage.getItem('expenseEntries') || '[]') || generateSampleExpenseData();
  
  // Calculate summary stats
  const totalExpenses = calculateTotal(expenseEntries, 'amount');
  const transactionCount = expenseEntries.length;
  const avgTransactionValue = transactionCount > 0 ? totalExpenses / transactionCount : 0;
  
  // Update summary stats
  document.querySelectorAll('.stat-value').forEach((el, index) => {
    switch(index) {
      case 0:
        el.textContent = `KSH ${totalExpenses.toLocaleString()}`;
        break;
      case 1:
        el.textContent = transactionCount;
        break;
      case 2:
        el.textContent = `KSH ${avgTransactionValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        break;
    }
  });
  
  // Update expenses table
  updateExpensesTable(expenseEntries);
}

// Update expenses table with data
function updateExpensesTable(expenseEntries) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Sort by date (most recent first)
  const sortedEntries = [...expenseEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedEntries.forEach(entry => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${entry.expense_number}</td>
      <td>${formatDate(entry.date)}</td>
      <td>${entry.category}</td>
      <td>${entry.description}</td>
      <td>${entry.vendor || '-'}</td>
      <td>${entry.amount?.toLocaleString()}</td>
      <td>${entry.payment_method}</td>
      <td>${entry.created_by_name || entry.created_by || 'Unknown'}</td>
      <td><span class="status success">Completed</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Set up expenses filters and search
function setupExpensesFilters() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      console.log('Searching for expenses:', this.value);
    });
  }
  
  // Export button functionality
  const exportBtn = document.querySelector('.btn-secondary');
  if (exportBtn && exportBtn.textContent === 'Export') {
    exportBtn.addEventListener('click', function() {
      alert('Export functionality would be implemented here');
    });
  }
}

// Initialize reports page
function initializeReportsPage() {
  setupReportGeneration();
  loadGeneratedReports();
}

// Set up report generation
function setupReportGeneration() {
  const generateButtons = document.querySelectorAll('.report-card .btn-primary');
  generateButtons.forEach(button => {
    button.addEventListener('click', function() {
      const reportCard = this.closest('.report-card');
      const reportTitle = reportCard.querySelector('h3').textContent;
      alert(`Generating ${reportTitle}... This would be implemented with backend processing.`);
    });
  });
}

// Load generated reports
function loadGeneratedReports() {
  // Create reports table with dynamic buttons
  const tbody = document.querySelectorAll('.data-table tbody')[1]; // Second table
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Define available report types
  const reportTypes = [
    { name: 'Daily Sales Report', id: 'daily-sales' },
    { name: 'Monthly Sales Report', id: 'monthly-sales' },
    { name: 'Expense Analysis', id: 'expense-analysis' },
    { name: 'Diesel Consumption', id: 'diesel-report' },
    { name: 'Repairs Summary', id: 'repairs-summary' },
    { name: 'Damages Report', id: 'damages-report' },
    { name: 'Profit & Loss Statement', id: 'profit-loss' },
    { name: 'Customer Trends', id: 'customer-trends' }
  ];
  
  reportTypes.forEach(report => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${report.name}</td>
      <td>${formatDate(new Date().toISOString().split('T')[0])}</td>
      <td>${formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])} to ${formatDate(new Date().toISOString().split('T')[0])}</td>
      <td><span class="status success">Ready</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="generateCSVReport('${report.id}')">Generate CSV</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Return empty arrays for initial state
function generateSampleSalesData() {
  return [];
}

// Return empty arrays for initial state
function generateSampleExpenseData() {
  return [];
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES', // Kenyan Shilling
    minimumFractionDigits: 2
  }).format(amount);
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Refresh data periodically (in a real app)
function refreshData() {
  // This would fetch fresh data from the backend
  // For demo, we'll just reload the current data
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/management/dashboard.html')) {
    loadDashboardData();
  } else if (currentPath.includes('/management/sales.html')) {
    loadSalesData();
  } else if (currentPath.includes('/management/expenses.html')) {
    loadExpensesData();
  }
}

// Initialize diesel dashboard
function initializeDieselDashboard() {
  loadDieselData();
  setupDateRangeSelector();
  setupDieselFilters();
}

// Load diesel data for diesel management page
async function loadDieselData() {
  // Get diesel data from Supabase database with fallback to localStorage
  const { data, error } = await window.supabaseClient.from('diesel_transactions').select('*');
  
  if (error) {
    console.error('Error fetching diesel data from Supabase:', error);
  }
  
  const dieselEntries = data || JSON.parse(localStorage.getItem('dieselEntries') || '[]') || [];
  
  // Calculate summary stats
  const totalCost = calculateTotal(dieselEntries, 'total_cost');
  const totalLiters = calculateTotal(dieselEntries, 'liters');
  const avgPricePerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;
  
  // Update summary stats
  document.querySelectorAll('.stat-value').forEach((el, index) => {
    switch(index) {
      case 0:
        el.textContent = `KSH ${totalCost.toLocaleString()}`;
        break;
      case 1:
        el.textContent = totalLiters;
        break;
      case 2:
        el.textContent = `KSH ${(avgPricePerLiter).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
        break;
    }
  });
  
  // Update diesel table
  updateDieselTable(dieselEntries);
}

// Update diesel table with data
function updateDieselTable(dieselEntries) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Sort by date (most recent first)
  const sortedEntries = [...dieselEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedEntries.forEach(entry => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${entry.transaction_number}</td>
      <td>${formatDate(entry.date)}</td>
      <td>${entry.supplier}</td>
      <td>${entry.liters}</td>
      <td>${entry.unit_price?.toLocaleString()}</td>
      <td>${entry.total_cost?.toLocaleString()}</td>
      <td>${entry.vehicle || '-'}</td>
      <td>${entry.payment_method}</td>
      <td>${entry.created_by_name || entry.created_by || 'Unknown'}</td>
      <td><span class="status success">Completed</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Set up diesel filters and search
function setupDieselFilters() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      console.log('Searching for diesel:', this.value);
    });
  }
  
  // Export button functionality
  const exportBtn = document.querySelector('.btn-secondary');
  if (exportBtn && exportBtn.textContent === 'Export') {
    exportBtn.addEventListener('click', function() {
      alert('Export functionality would be implemented here');
    });
  }
}

// Initialize repairs dashboard
function initializeRepairsDashboard() {
  loadRepairsData();
  setupDateRangeSelector();
  setupRepairsFilters();
}

// Load repairs data
async function loadRepairsData() {
  // Get repairs data from Supabase database with fallback to localStorage
  const { data, error } = await window.supabaseClient.from('repair_transactions').select('*');
  
  if (error) {
    console.error('Error fetching repair data from Supabase:', error);
  }
  
  const repairEntries = data || JSON.parse(localStorage.getItem('repairEntries') || '[]') || [];
  
  // Calculate summary stats
  const totalCost = calculateTotal(repairEntries, 'cost');
  const transactionCount = repairEntries.length;
  const avgTransactionValue = transactionCount > 0 ? totalCost / transactionCount : 0;
  
  // Update summary stats
  document.querySelectorAll('.stat-value').forEach((el, index) => {
    switch(index) {
      case 0:
        el.textContent = `KSH ${totalCost.toLocaleString()}`;
        break;
      case 1:
        el.textContent = transactionCount;
        break;
      case 2:
        el.textContent = `KSH ${avgTransactionValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        break;
    }
  });
  
  // Update repairs table
  updateRepairsTable(repairEntries);
}

// Update repairs table with data
function updateRepairsTable(repairEntries) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Sort by date (most recent first)
  const sortedEntries = [...repairEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedEntries.forEach(entry => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${entry.repair_number}</td>
      <td>${formatDate(entry.date)}</td>
      <td>${entry.equipment}</td>
      <td>${entry.repair_type}</td>
      <td>${entry.problem_description}</td>
      <td>${entry.cost?.toLocaleString()}</td>
      <td>${entry.repair_shop || '-'}</td>
      <td>${entry.payment_method}</td>
      <td>${entry.created_by_name || entry.created_by || 'Unknown'}</td>
      <td><span class="status success">Completed</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Set up repairs filters and search
function setupRepairsFilters() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      console.log('Searching for repairs:', this.value);
    });
  }
  
  // Export button functionality
  const exportBtn = document.querySelector('.btn-secondary');
  if (exportBtn && exportBtn.textContent === 'Export') {
    exportBtn.addEventListener('click', function() {
      alert('Export functionality would be implemented here');
    });
  }
}

// Initialize damages dashboard
function initializeDamagesDashboard() {
  loadDamagesData();
  setupDateRangeSelector();
  setupDamagesFilters();
}

// Load damages data
async function loadDamagesData() {
  // Get damages data from Supabase database with fallback to localStorage
  const { data, error } = await window.supabaseClient.from('damage_transactions').select('*');
  
  if (error) {
    console.error('Error fetching damage data from Supabase:', error);
  }
  
  const damageEntries = data || JSON.parse(localStorage.getItem('damageEntries') || '[]') || [];
  
  // Calculate summary stats
  const totalValue = calculateTotal(damageEntries, 'estimated_value');
  const incidentCount = damageEntries.length;
  const avgValue = incidentCount > 0 ? totalValue / incidentCount : 0;
  
  // Update summary stats
  document.querySelectorAll('.stat-value').forEach((el, index) => {
    switch(index) {
      case 0:
        el.textContent = `KSH ${totalValue.toLocaleString()}`;
        break;
      case 1:
        el.textContent = incidentCount;
        break;
      case 2:
        el.textContent = `KSH ${avgValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        break;
    }
  });
  
  // Update damages table
  updateDamagesTable(damageEntries);
}

// Update damages table with data
function updateDamagesTable(damageEntries) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Sort by date (most recent first)
  const sortedEntries = [...damageEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedEntries.forEach(entry => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${entry.damage_number}</td>
      <td>${formatDate(entry.date)}</td>
      <td>${entry.item_type}</td>
      <td>${entry.item_name}</td>
      <td>${entry.damage_cause}</td>
      <td>${entry.estimated_value?.toLocaleString()}</td>
      <td>${entry.severity}</td>
      <td>${entry.responsible_party || '-'}</td>
      <td>${entry.created_by_name || entry.created_by || 'Unknown'}</td>
      <td><span class="status success">Completed</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Set up damages filters and search
function setupDamagesFilters() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      console.log('Searching for damages:', this.value);
    });
  }
  
  // Export button functionality
  const exportBtn = document.querySelector('.btn-secondary');
  if (exportBtn && exportBtn.textContent === 'Export') {
    exportBtn.addEventListener('click', function() {
      alert('Export functionality would be implemented here');
    });
  }
}

// Function to generate CSV reports
async function generateCSVReport(reportId) {
  try {
    let data = [];
    let filename = '';
    let headers = [];
    
    // Determine what data to fetch based on report type
    switch(reportId) {
      case 'daily-sales':
      case 'monthly-sales':
        // Fetch sales data from Supabase
        const salesResult = await window.supabaseClient.from('sales_transactions').select('*');
        if (salesResult.error) {
          console.warn('Sales table may not exist or is empty, using localStorage data:', salesResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('salesEntries') || '[]');
        } else {
          data = salesResult.data;
        }
        
        filename = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Receipt Number', 'Date', 'Customer Name', 'Contact Info', 'Product Type', 'Quantity', 'Unit Price', 'Total Amount', 'Payment Method', 'Notes', 'Created At'];
        break;
        
      case 'expense-analysis':
        // Fetch expenses data from Supabase
        const expenseResult = await window.supabaseClient.from('expense_transactions').select('*');
        if (expenseResult.error) {
          console.warn('Expense table may not exist or is empty, using localStorage data:', expenseResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('expenseEntries') || '[]');
        } else {
          data = expenseResult.data;
        }
        
        filename = `expenses_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Expense Number', 'Date', 'Category', 'Vendor', 'Description', 'Amount', 'Payment Method', 'Notes', 'Created At'];
        break;
        
      case 'diesel-report':
        // Fetch diesel data from Supabase
        const dieselResult = await window.supabaseClient.from('diesel_transactions').select('*');
        if (dieselResult.error) {
          console.warn('Diesel table may not exist or is empty, using localStorage data:', dieselResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('dieselEntries') || '[]');
        } else {
          data = dieselResult.data;
        }
        
        filename = `diesel_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Transaction Number', 'Date', 'Supplier', 'Liters', 'Unit Price', 'Total Cost', 'Vehicle', 'Driver', 'Payment Method', 'Notes', 'Created At'];
        break;
        
      case 'repairs-summary':
        // Fetch repairs data from Supabase
        const repairResult = await window.supabaseClient.from('repair_transactions').select('*');
        if (repairResult.error) {
          console.warn('Repairs table may not exist or is empty, using localStorage data:', repairResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('repairEntries') || '[]');
        } else {
          data = repairResult.data;
        }
        
        filename = `repairs_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Repair Number', 'Date', 'Equipment', 'Repair Type', 'Problem Description', 'Cost', 'Repair Shop', 'Technician', 'Payment Method', 'Notes', 'Created At'];
        break;
        
      case 'damages-report':
        // Fetch damages data from Supabase
        const damageResult = await window.supabaseClient.from('damage_transactions').select('*');
        if (damageResult.error) {
          console.warn('Damages table may not exist or is empty, using localStorage data:', damageResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('damageEntries') || '[]');
        } else {
          data = damageResult.data;
        }
        
        filename = `damages_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Damage Number', 'Date', 'Item Type', 'Item Name', 'Damage Cause', 'Estimated Value', 'Severity', 'Responsible Party', 'Description', 'Notes', 'Created At'];
        break;
        
      case 'cash-flow':
        // Combine sales and expenses for cash flow report
        const cashFlowSalesResult = await window.supabaseClient.from('sales_transactions').select('*');
        const cashFlowExpensesResult = await window.supabaseClient.from('expense_transactions').select('*');
        
        let salesEntries = [];
        let expenseEntries = [];
        
        if (cashFlowSalesResult.error) {
          console.warn('Sales table may not exist or is empty for cash flow report:', cashFlowSalesResult.error);
          // Fallback to localStorage data
          const salesFromStorage = JSON.parse(localStorage.getItem('salesEntries') || '[]');
          salesEntries = salesFromStorage.map(item => ({
            date: item.date,
            type: 'Income',
            description: `Sale - ${item.customer_name || 'Unknown'}`,
            amount: item.total_amount,
            category: 'Sales Revenue'
          }));
        } else {
          salesEntries = cashFlowSalesResult.data.map(item => ({
            date: item.date,
            type: 'Income',
            description: `Sale - ${item.customer_name}`,
            amount: item.total_amount,
            category: 'Sales Revenue'
          }));
        }
        
        if (cashFlowExpensesResult.error) {
          console.warn('Expense table may not exist or is empty for cash flow report:', cashFlowExpensesResult.error);
          // Fallback to localStorage data
          const expensesFromStorage = JSON.parse(localStorage.getItem('expenseEntries') || '[]');
          expenseEntries = expensesFromStorage.map(item => ({
            date: item.date,
            type: 'Expense',
            description: item.description || 'Expense',
            amount: -(item.amount || 0),
            category: item.category || 'General'
          }));
        } else {
          expenseEntries = cashFlowExpensesResult.data.map(item => ({
            date: item.date,
            type: 'Expense',
            description: item.description,
            amount: -item.amount,
            category: item.category
          }));
        }
        
        data = [...salesEntries, ...expenseEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
        filename = `cash_flow_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
        break;
        
      case 'inventory':
        // For now, use sales data to show inventory movement
        // In a real system, this would come from an inventory table
        const inventoryResult = await window.supabaseClient.from('sales_transactions').select('*');
        if (inventoryResult.error) {
          console.warn('Sales table may not exist or is empty for inventory report:', inventoryResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('salesEntries') || '[]');
        } else {
          data = inventoryResult.data;
        }
        
        filename = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Receipt Number', 'Date', 'Product Type', 'Quantity', 'Customer Name', 'Notes'];
        break;
        
      default:
        // Default to all sales data
        const defaultResult = await window.supabaseClient.from('sales_transactions').select('*');
        if (defaultResult.error) {
          console.warn('Sales table may not exist or is empty, using localStorage data:', defaultResult.error);
          // Fallback to localStorage data
          data = JSON.parse(localStorage.getItem('salesEntries') || '[]');
        } else {
          data = defaultResult.data;
        }
        
        filename = `report_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Receipt Number', 'Date', 'Customer Name', 'Contact Info', 'Product Type', 'Quantity', 'Unit Price', 'Total Amount', 'Payment Method', 'Notes', 'Created At'];
    }
    
    // Convert data to CSV format
    const csvContent = convertToCSV(data, headers);
    
    // Create and download the CSV file
    downloadCSV(csvContent, filename);
    
    alert(`${filename} generated successfully!`);
  } catch (error) {
    console.error('Error generating CSV report:', error);
    alert('Error generating report. Please try again.');
  }
}

// Convert data to CSV format
function convertToCSV(data, headers) {
  // Create header row
  let csv = headers.join(',') + '\n';
  
  // Process each row of data
  data.forEach(item => {
    const values = [];
    
    // Map headers to data properties
    headers.forEach(header => {
      let value = '';
      
      switch(header) {
        case 'Receipt Number':
          value = item.receipt_number || '';
          break;
        case 'Date':
          value = item.date || '';
          break;
        case 'Customer Name':
          value = item.customer_name || '';
          break;
        case 'Contact Info':
          value = item.contact_info || '';
          break;
        case 'Product Type':
          value = item.product_type || '';
          break;
        case 'Quantity':
          value = item.quantity || '';
          break;
        case 'Unit Price':
          value = item.unit_price || '';
          break;
        case 'Total Amount':
          value = item.total_amount || '';
          break;
        case 'Payment Method':
          value = item.payment_method || '';
          break;
        case 'Notes':
          value = item.notes || '';
          break;
        case 'Created At':
          value = item.created_at || '';
          break;
        case 'Expense Number':
          value = item.expense_number || '';
          break;
        case 'Category':
          value = item.category || '';
          break;
        case 'Vendor':
          value = item.vendor || '';
          break;
        case 'Description':
          value = item.description || '';
          break;
        case 'Amount':
          value = item.amount || '';
          break;
        case 'Transaction Number':
          value = item.transaction_number || '';
          break;
        case 'Supplier':
          value = item.supplier || '';
          break;
        case 'Liters':
          value = item.liters || '';
          break;
        case 'Unit Price':
          value = item.unit_price || '';
          break;
        case 'Total Cost':
          value = item.total_cost || '';
          break;
        case 'Type':
          value = item.type || '';
          break;
        case 'Vehicle':
          value = item.vehicle || '';
          break;
        case 'Driver':
          value = item.driver || '';
          break;
        case 'Repair Number':
          value = item.repair_number || '';
          break;
        case 'Equipment':
          value = item.equipment || '';
          break;
        case 'Repair Type':
          value = item.repair_type || '';
          break;
        case 'Problem Description':
          value = item.problem_description || '';
          break;
        case 'Cost':
          value = item.cost || '';
          break;
        case 'Repair Shop':
          value = item.repair_shop || '';
          break;
        case 'Technician':
          value = item.technician || '';
          break;
        case 'Damage Number':
          value = item.damage_number || '';
          break;
        case 'Item Type':
          value = item.item_type || '';
          break;
        case 'Item Name':
          value = item.item_name || '';
          break;
        case 'Damage Cause':
          value = item.damage_cause || '';
          break;
        case 'Estimated Value':
          value = item.estimated_value || '';
          break;
        case 'Severity':
          value = item.severity || '';
          break;
        case 'Responsible Party':
          value = item.responsible_party || '';
          break;
        case 'Amount':
          value = item.amount || '';
          break;
        default:
          value = item[header.toLowerCase().replace(/ /g, '_')] || '';
      }
      
      // Escape commas and quotes in values
      if (typeof value === 'string') {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
      }
      
      values.push(value);
    });
    
    csv += values.join(',') + '\n';
  });
  
  return csv;
}

// Download CSV file
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Fallback for older browsers
    const csvData = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    window.open(csvData);
  }
}

// Show user management modal
function showUserManagement() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('userManagementModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'userManagementModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="width: 90%; max-width: 900px;">
        <div class="modal-header">
          <h3>User Management</h3>
          <span class="close" onclick="closeUserManagementModal()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="user-management-actions">
            <button class="btn btn-primary" onclick="openAddUserModal()">Add New User</button>
            <div class="search-filter-container">
              <input type="text" class="search-input" placeholder="Search users..." />
              <select class="filter-select">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="management">Management</option>
                <option value="entry">Entry</option>
              </select>
            </div>
          </div>
          <div class="data-table-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <!-- Users will be populated here -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeUserManagementModal()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Load users
  loadUsers();
  
  // Show modal
  modal.style.display = 'block';
}

// Close user management modal
function closeUserManagementModal() {
  const modal = document.getElementById('userManagementModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Load users from storage
function loadUsers() {
  // Get users from localStorage or create default users
  let users = JSON.parse(localStorage.getItem('users')) || [
    { 
      id: '1', 
      email: 'admin@starland.com', 
      name: 'System Administrator', 
      role: 'management', 
      status: 'active', 
      last_login: 'Today, 10:30 AM' 
    },
    { 
      id: '2', 
      email: 'manager@starland.com', 
      name: 'John Smith', 
      role: 'management', 
      status: 'active', 
      last_login: 'Today, 9:45 AM' 
    },
    { 
      id: '3', 
      email: 'clerk1@starland.com', 
      name: 'Sarah Johnson', 
      role: 'entry', 
      status: 'active', 
      last_login: 'Yesterday, 4:20 PM' 
    },
    { 
      id: '4', 
      email: 'clerk2@starland.com', 
      name: 'Michael Brown', 
      role: 'entry', 
      status: 'active', 
      last_login: 'June 14, 2023' 
    },
    { 
      id: '5', 
      email: 'accountant@starland.com', 
      name: 'Emily Davis', 
      role: 'management', 
      status: 'active', 
      last_login: 'Today, 8:15 AM' 
    }
  ];
  
  renderUsers(users);
}

// Render users in the table
function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  users.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.name}</td>
      <td><span class="role-badge ${user.role}">${formatRole(user.role)}</span></td>
      <td><span class="status ${user.status === 'active' ? 'success' : 'warning'}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
      <td>${user.last_login}</td>
      <td>
        <button class="btn btn-sm btn-secondary edit-user" data-user-id="${user.id}" onclick="openEditUserModal('${user.id}')">Edit</button>
        <button class="btn btn-sm btn-danger toggle-user" data-user-id="${user.id}" data-status="${user.status}" onclick="toggleUserStatus('${user.id}')">
          ${user.status === 'active' ? 'Disable' : 'Enable'}
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Format role for display
function formatRole(role) {
  switch(role) {
    case 'admin':
      return 'Admin';
    case 'management':
      return 'Management';
    case 'entry':
      return 'Data Entry';
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

// Open add user modal
function openAddUserModal() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('addUserModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'addUserModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="width: 90%; max-width: 500px;">
        <div class="modal-header">
          <h3 id="modalTitle">Add New User</h3>
          <span class="close" onclick="closeAddUserModal()">&times;</span>
        </div>
        <div class="modal-body">
          <form id="userForm">
            <div class="form-group">
              <label for="userEmail">Email</label>
              <input type="email" id="userEmail" required />
            </div>
            <div class="form-group">
              <label for="userName">Full Name</label>
              <input type="text" id="userName" required />
            </div>
            <div class="form-group">
              <label for="userRole">Role</label>
              <select id="userRole" required>
                <option value="management">Management</option>
                <option value="entry">Data Entry</option>
              </select>
            </div>
            <div class="form-group">
              <label for="userStatus">Status</label>
              <select id="userStatus" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeAddUserModal()" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" onclick="saveUser()" id="saveUserBtn">Save User</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Reset form
  document.getElementById('userForm').reset();
  
  // Show modal
  modal.style.display = 'block';
}

// Close add user modal
function closeAddUserModal() {
  const modal = document.getElementById('addUserModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Open edit user modal
function openEditUserModal(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.id == userId);
  
  if (!user) return;
  
  // Create modal if it doesn't exist
  let modal = document.getElementById('addUserModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'addUserModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="width: 90%; max-width: 500px;">
        <div class="modal-header">
          <h3 id="modalTitle">Edit User</h3>
          <span class="close" onclick="closeAddUserModal()">&times;</span>
        </div>
        <div class="modal-body">
          <form id="userForm">
            <div class="form-group">
              <label for="userEmail">Email</label>
              <input type="email" id="userEmail" required />
            </div>
            <div class="form-group">
              <label for="userName">Full Name</label>
              <input type="text" id="userName" required />
            </div>
            <div class="form-group">
              <label for="userRole">Role</label>
              <select id="userRole" required>
                <option value="management">Management</option>
                <option value="entry">Data Entry</option>
              </select>
            </div>
            <div class="form-group">
              <label for="userStatus">Status</label>
              <select id="userStatus" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeAddUserModal()" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" onclick="saveUser()" id="saveUserBtn">Save User</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Populate form with user data
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userName').value = user.name;
  document.getElementById('userRole').value = user.role;
  document.getElementById('userStatus').value = user.status;
  
  // Store user ID in form for update
  document.getElementById('userForm').setAttribute('data-user-id', user.id);
  
  // Show modal
  modal.style.display = 'block';
}

// Save user (create or update)
function saveUser() {
  const form = document.getElementById('userForm');
  const userId = form.getAttribute('data-user-id');
  const isEditing = !!userId;
  
  // Get form data
  const userData = {
    email: document.getElementById('userEmail').value,
    name: document.getElementById('userName').value,
    role: document.getElementById('userRole').value,
    status: document.getElementById('userStatus').value
  };
  
  // Validate form
  if (!validateUserForm(userData)) {
    return;
  }
  
  // Get existing users
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (isEditing) {
    // Update existing user
    const userIndex = users.findIndex(u => u.id == userId);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        id: userId // Keep the same ID
      };
    }
  } else {
    // Create new user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation for demo
      ...userData,
      last_login: 'Never' // New users haven't logged in yet
    };
    users.push(newUser);
  }
  
  // Save users back to storage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Close modal and refresh user list
  closeAddUserModal();
  loadUsers();
  
  // Show success message
  alert(isEditing ? 'User updated successfully!' : 'User created successfully!');
}

// Validate user form
function validateUserForm(userData) {
  if (!userData.email || !userData.email.includes('@')) {
    alert('Please enter a valid email address');
    return false;
  }
  
  if (!userData.name || userData.name.trim().length < 2) {
    alert('Please enter a valid name (at least 2 characters)');
    return false;
  }
  
  if (!['management', 'entry'].includes(userData.role)) {
    alert('Please select a valid role');
    return false;
  }
  
  return true;
}

// Toggle user status
function toggleUserStatus(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id == userId);
  
  if (userIndex === -1) {
    alert('User not found');
    return;
  }
  
  // Toggle status
  users[userIndex].status = users[userIndex].status === 'active' ? 'inactive' : 'active';
  
  // Save updated users
  localStorage.setItem('users', JSON.stringify(users));
  
  // Refresh user list
  loadUsers();
  
  alert(`User ${users[userIndex].status === 'active' ? 'enabled' : 'disabled'} successfully!`);
}

// Show audit logs
function showAuditLogs() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('auditLogsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'auditLogsModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="width: 95%; max-width: 1200px; height: 80vh;">
        <div class="modal-header">
          <h3>Audit Logs</h3>
          <span class="close" onclick="closeAuditLogsModal()">&times;</span>
        </div>
        <div class="modal-body" style="height: calc(100% - 120px); overflow-y: auto;">
          <div class="audit-filters">
            <div class="filter-group">
              <label for="dateFrom">Date From</label>
              <input type="date" id="dateFrom" />
            </div>
            <div class="filter-group">
              <label for="dateTo">Date To</label>
              <input type="date" id="dateTo" />
            </div>
            <div class="filter-group">
              <label for="userFilter">User</label>
              <select id="userFilter">
                <option value="all">All Users</option>
                <option value="admin">Admin</option>
                <option value="management">Management</option>
                <option value="entry">Entry</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="actionFilter">Action</label>
              <select id="actionFilter">
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="data_entry">Data Entry</option>
                <option value="report">Report Generation</option>
              </select>
            </div>
            <button class="btn btn-secondary" onclick="applyAuditFilters()">Apply Filters</button>
          </div>
          <div class="table-actions">
            <button class="btn btn-secondary" onclick="exportAuditLogs()">Export Logs</button>
            <button class="btn btn-danger" onclick="clearAuditLogs()">Clear Logs</button>
          </div>
          <div class="data-table-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Details</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="auditLogsTableBody">
                <!-- Audit logs will be populated here -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeAuditLogsModal()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Load audit logs
  loadAuditLogs();
  
  // Show modal
  modal.style.display = 'block';
}

// Close audit logs modal
function closeAuditLogsModal() {
  const modal = document.getElementById('auditLogsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Load audit logs
function loadAuditLogs() {
  // For demo purposes, create sample audit data
  const sampleAuditLogs = [
    { timestamp: '2023-06-15 10:45:22', user: 'admin@starland.com', action: 'User Created', module: 'User Management', details: 'Created user: clerk3@starland.com', ip_address: '192.168.1.100', status: 'Success' },
    { timestamp: '2023-06-15 10:30:15', user: 'manager@starland.com', action: 'Sales Entry', module: 'Sales Module', details: 'Added sale: SAL-2023-001 (KSH 15,000)', ip_address: '192.168.1.101', status: 'Success' },
    { timestamp: '2023-06-15 09:15:43', user: 'clerk1@starland.com', action: 'Expense Recorded', module: 'Expenses Module', details: 'Added expense: EXP-2023-001 (KSH 8,500)', ip_address: '192.168.1.102', status: 'Success' },
    { timestamp: '2023-06-15 08:30:10', user: 'admin@starland.com', action: 'System Backup', module: 'System Admin', details: 'Manual backup initiated', ip_address: '192.168.1.100', status: 'Success' },
    { timestamp: '2023-06-15 07:45:30', user: 'manager@starland.com', action: 'Report Generated', module: 'Reporting Module', details: 'Generated monthly sales report', ip_address: '192.168.1.101', status: 'Success' },
    { timestamp: '2023-06-14 16:20:55', user: 'clerk2@starland.com', action: 'Diesel Entry', module: 'Diesel Module', details: 'Added diesel purchase: DSL-2023-001 (200L)', ip_address: '192.168.1.103', status: 'Success' },
    { timestamp: '2023-06-14 15:10:12', user: 'admin@starland.com', action: 'Login', module: 'Authentication', details: 'Successful login from admin account', ip_address: '192.168.1.100', status: 'Success' }
  ];
  
  // In a real app, we would get this from storage
  localStorage.setItem('auditLogs', JSON.stringify(sampleAuditLogs));
  
  renderAuditLogs(sampleAuditLogs);
}

// Render audit logs in the table
function renderAuditLogs(logs) {
  const tbody = document.getElementById('auditLogsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  logs.forEach(log => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${log.timestamp}</td>
      <td>${log.user}</td>
      <td>${log.action}</td>
      <td>${log.module}</td>
      <td>${log.details}</td>
      <td>${log.ip_address}</td>
      <td><span class="status ${log.status.toLowerCase()}">${log.status}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Apply audit filters
function applyAuditFilters() {
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;
  const userFilter = document.getElementById('userFilter').value;
  const actionFilter = document.getElementById('actionFilter').value;
  
  let logs = JSON.parse(localStorage.getItem('auditLogs')) || [];
  
  // Apply date filters
  if (dateFrom) {
    logs = logs.filter(log => log.timestamp >= `${dateFrom} 00:00:00`);
  }
  
  if (dateTo) {
    logs = logs.filter(log => log.timestamp <= `${dateTo} 23:59:59`);
  }
  
  // Apply user filter
  if (userFilter !== 'all') {
    logs = logs.filter(log => log.user.includes(userFilter));
  }
  
  // Apply action filter
  if (actionFilter !== 'all') {
    logs = logs.filter(log => log.action.toLowerCase().includes(actionFilter.toLowerCase()));
  }
  
  renderAuditLogs(logs);
}

// Export audit logs
function exportAuditLogs() {
  const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];
  
  // Create CSV content
  const csvContent = [
    ['Timestamp', 'User', 'Action', 'Module', 'Details', 'IP Address', 'Status'].join(','),
    ...logs.map(log => [
      '"' + log.timestamp.replace(/"/g, '') + '"',
      '"' + log.user.replace(/"/g, '') + '"',
      '"' + log.action.replace(/"/g, '') + '"',
      '"' + log.module.replace(/"/g, '') + '"',
      '"' + log.details.replace(/"/g, '') + '"',
      '"' + log.ip_address.replace(/"/g, '') + '"',
      '"' + log.status.replace(/"/g, '') + '"'
    ].join(','))
  ].join('\\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'audit-logs-' + new Date().toISOString().split('T')[0] + '.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert('Audit logs exported successfully!');
}

// Clear audit logs
function clearAuditLogs() {
  if (confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
    localStorage.removeItem('auditLogs');
    loadAuditLogs(); // Reload with empty logs
    alert('Audit logs cleared successfully!');
  }
}

// Set up auto-refresh if needed
setInterval(refreshData, 300000); // Refresh every 5 minutes

// Load users for management dashboard
async function loadUsers() {
  try {
    // Get users from localStorage or create default users
    let users = JSON.parse(localStorage.getItem('users')) || [
      { 
        id: '1', 
        email: 'admin@starland.com', 
        name: 'System Administrator', 
        role: 'admin', 
        status: 'active', 
        last_login: 'Today, 10:30 AM' 
      },
      { 
        id: '2', 
        email: 'manager@starland.com', 
        name: 'John Smith', 
        role: 'management', 
        status: 'active', 
        last_login: 'Today, 9:45 AM' 
      },
      { 
        id: '3', 
        email: 'clerk1@starland.com', 
        name: 'Sarah Johnson', 
        role: 'entry', 
        status: 'active', 
        last_login: 'Yesterday, 4:20 PM' 
      },
      { 
        id: '4', 
        email: 'clerk2@starland.com', 
        name: 'Michael Brown', 
        role: 'entry', 
        status: 'active', 
        last_login: 'June 14, 2023' 
      },
      { 
        id: '5', 
        email: 'accountant@starland.com', 
        name: 'Emily Davis', 
        role: 'management', 
        status: 'active', 
        last_login: 'Today, 8:15 AM' 
      }
    ];
    
    renderUsers(users);
  } catch (error) {
    console.error('Error loading users:', error);
    
    // Fallback to default users if localStorage fails
    const defaultUsers = [
      { id: '1', email: 'admin@starland.com', name: 'System Administrator', role: 'admin', status: 'active', last_login: 'Today, 10:30 AM' },
      { id: '2', email: 'manager@starland.com', name: 'John Smith', role: 'management', status: 'active', last_login: 'Today, 9:45 AM' },
      { id: '3', email: 'clerk1@starland.com', name: 'Sarah Johnson', role: 'entry', status: 'active', last_login: 'Yesterday, 4:20 PM' }
    ];
    
    renderUsers(defaultUsers);
  }
}

// Render users in the table
function renderUsers(users) {
  const tbody = document.getElementById('usersList');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  users.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${formatRole(user.role)}</td>
      <td><span class="status ${user.status === 'active' ? 'success' : 'warning'}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary edit-user" data-user-id="${user.id}" onclick="openEditUser('${user.id}')">Edit</button>
        <button class="btn btn-sm btn-danger toggle-user" data-user-id="${user.id}" data-status="${user.status}" onclick="toggleUserStatus('${user.id}')">
          ${user.status === 'active' ? 'Disable' : 'Enable'}
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Format role for display
function formatRole(role) {
  switch(role) {
    case 'admin':
      return 'Admin';
    case 'management':
      return 'Management';
    case 'entry':
      return 'Data Entry';
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

// Open edit user modal
function openEditUser(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.id == userId);
  
  if (!user) return;
  
  // Populate form with user data
  document.getElementById('newUserEmail').value = user.email;
  document.getElementById('newUserRole').value = user.role;
  
  // Set form attribute to indicate edit mode
  document.getElementById('addUserFormElement').setAttribute('data-user-id', user.id);
  document.getElementById('addUserFormElement').setAttribute('data-edit-mode', 'true');
  
  // Update button text
  const submitBtn = document.querySelector('#addUserFormElement button[type="submit"]');
  submitBtn.textContent = 'Update User';
  
  // Show modal
  document.getElementById('userManagementContent').style.display = 'none';
  document.getElementById('addUserForm').style.display = 'block';
}

// Save user (create or update)
async function saveUser() {
  const form = document.getElementById('addUserFormElement');
  const userId = form.getAttribute('data-user-id');
  const isEditing = form.getAttribute('data-edit-mode') === 'true';
  
  // Get form data
  const userData = {
    email: document.getElementById('newUserEmail').value,
    role: document.getElementById('newUserRole').value
  };
  
  // Validate form
  if (!validateUserForm(userData)) {
    return;
  }
  
  // Get existing users
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (isEditing) {
    // Update existing user
    const userIndex = users.findIndex(u => u.id == userId);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        id: userId // Keep the same ID
      };
    }
    
    // Reset form to create mode
    form.removeAttribute('data-user-id');
    form.removeAttribute('data-edit-mode');
    const submitBtn = document.querySelector('#addUserFormElement button[type="submit"]');
    submitBtn.textContent = 'Create User';
  } else {
    // Create new user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation for demo
      ...userData,
      name: userData.email.split('@')[0], // Use email prefix as name
      status: 'active',
      last_login: 'Never' // New users haven't logged in yet
    };
    users.push(newUser);
  }
  
  // Save users back to storage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Hide form and show user list
  document.getElementById('userManagementContent').style.display = 'block';
  document.getElementById('addUserForm').style.display = 'none';
  
  // Reset form
  form.reset();
  
  // Refresh user list
  loadUsers();
  
  // Show success message
  alert(isEditing ? 'User updated successfully!' : 'User created successfully!');
}

// Validate user form
function validateUserForm(userData) {
  if (!userData.email || !userData.email.includes('@')) {
    alert('Please enter a valid email address');
    return false;
  }
  
  if (!['management', 'entry'].includes(userData.role)) {  // Management can't create admin users
    alert('Please select a valid role');
    return false;
  }
  
  return true;
}

// Toggle user status
function toggleUserStatus(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id == userId);
  
  if (userIndex === -1) {
    alert('User not found');
    return;
  }
  
  // Toggle status
  users[userIndex].status = users[userIndex].status === 'active' ? 'inactive' : 'active';
  
  // Save updated users
  localStorage.setItem('users', JSON.stringify(users));
  
  // Refresh user list
  loadUsers();
  
  alert(`User ${users[userIndex].status === 'active' ? 'enabled' : 'disabled'} successfully!`);
}

// Add event listener to the form submission
if (document.getElementById('addUserFormElement')) {
  document.getElementById('addUserFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    saveUser();
  });
}

// Load audit logs
function loadAuditLogs() {
  // For demo purposes, create sample audit data
  const sampleAuditLogs = [
    { timestamp: '2023-06-15 10:45:22', user: 'admin@starland.com', action: 'User Created', recordType: 'User Management', details: 'Created user: clerk3@starland.com', status: 'Success' },
    { timestamp: '2023-06-15 10:30:15', user: 'manager@starland.com', action: 'Sales Entry', recordType: 'Sales Module', details: 'Added sale: SAL-2023-001 (KSH 15,000)', status: 'Success' },
    { timestamp: '2023-06-15 09:15:43', user: 'clerk1@starland.com', action: 'Expense Recorded', recordType: 'Expenses Module', details: 'Added expense: EXP-2023-001 (KSH 8,500)', status: 'Success' },
    { timestamp: '2023-06-15 08:30:10', user: 'admin@starland.com', action: 'System Backup', recordType: 'System Admin', details: 'Manual backup initiated', status: 'Success' },
    { timestamp: '2023-06-15 07:45:30', user: 'manager@starland.com', action: 'Report Generated', recordType: 'Reporting Module', details: 'Generated monthly sales report', status: 'Success' },
    { timestamp: '2023-06-14 16:20:55', user: 'clerk2@starland.com', action: 'Diesel Entry', recordType: 'Diesel Module', details: 'Added diesel purchase: DSL-2023-001 (200L)', status: 'Success' },
    { timestamp: '2023-06-14 15:10:12', user: 'admin@starland.com', action: 'Login', recordType: 'Authentication', details: 'Successful login from admin account', status: 'Success' }
  ];
  
  // In a real app, we would get this from storage
  localStorage.setItem('auditLogs', JSON.stringify(sampleAuditLogs));
  
  renderAuditLogs(sampleAuditLogs);
}

// Render audit logs in the table
function renderAuditLogs(logs) {
  const tbody = document.getElementById('auditLogsList');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  logs.forEach(log => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${log.timestamp}</td>
      <td>${log.user}</td>
      <td>${log.action}</td>
      <td>${log.recordType}</td>
      <td>${log.details}</td>
      <td><span class="status ${log.status.toLowerCase()}">${log.status}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// End of dashboard.js