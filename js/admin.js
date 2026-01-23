// Admin Logic for Starland Water Company System
// Handles admin functions, user management, and system monitoring

document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/admin/dashboard.html')) {
    initializeAdminDashboard();
  } else if (currentPath.includes('/admin/users.html')) {
    initializeUserManagement();
  } else if (currentPath.includes('/admin/audit.html')) {
    initializeAuditLogs();
  }
});

// Initialize admin dashboard
function initializeAdminDashboard() {
  loadAdminDashboardData();
  setupSystemMonitoring();
  initializeAdminCharts();
}

// Load admin dashboard data
async function loadAdminDashboardData() {
  try {
    // Get all data entries from database
    const salesResult = await window.supabaseClient.from('sales_transactions').select('*');
    const expenseResult = await window.supabaseClient.from('expense_transactions').select('*');
    const dieselResult = await window.supabaseClient.from('diesel_transactions').select('*');
    const repairResult = await window.supabaseClient.from('repair_transactions').select('*');
    const damageResult = await window.supabaseClient.from('damage_transactions').select('*');
    
    // Use database data or fallback to localStorage
    const salesEntries = salesResult.error ? JSON.parse(localStorage.getItem('salesEntries')) || [] : salesResult.data;
    const expenseEntries = expenseResult.error ? JSON.parse(localStorage.getItem('expenseEntries')) || [] : expenseResult.data;
    const dieselEntries = dieselResult.error ? JSON.parse(localStorage.getItem('dieselEntries')) || [] : dieselResult.data;
    const repairEntries = repairResult.error ? JSON.parse(localStorage.getItem('repairEntries')) || [] : repairResult.data;
    const damageEntries = damageResult.error ? JSON.parse(localStorage.getItem('damageEntries')) || [] : damageResult.data;
    
    // Calculate global metrics
    const totalRevenue = calculateTotal(salesEntries, 'total_amount');
    const totalExpenses = calculateTotal(expenseEntries, 'amount');
    const netProfit = totalRevenue - totalExpenses;
    
    // Get user data
    const users = JSON.parse(localStorage.getItem('users')) || [
      { email: 'admin@starland.com', name: 'System Administrator', role: 'admin', status: 'active', last_login: 'Today, 10:30 AM' },
      { email: 'manager@starland.com', name: 'John Smith', role: 'management', status: 'active', last_login: 'Today, 9:45 AM' },
      { email: 'clerk1@starland.com', name: 'Sarah Johnson', role: 'entry', status: 'active', last_login: 'Yesterday, 4:20 PM' },
      { email: 'clerk2@starland.com', name: 'Michael Brown', role: 'entry', status: 'active', last_login: 'June 14, 2023' },
      { email: 'accountant@starland.com', name: 'Emily Davis', role: 'management', status: 'active', last_login: 'Today, 8:15 AM' }
    ];
    
    // Update KPI cards
    document.querySelectorAll('.kpi-value').forEach((el, index) => {
      switch(index) {
        case 0:
          el.textContent = `KSH ${totalRevenue.toLocaleString()}`;
          break;
        case 1:
          el.textContent = `KSH ${totalExpenses.toLocaleString()}`;
          break;
        case 2:
          el.textContent = `KSH ${netProfit.toLocaleString()}`;
          break;
        case 3:
          el.textContent = users.length;
          break;
      }
    });
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);
    
    // Fallback to localStorage data if database fails
    const salesEntries = JSON.parse(localStorage.getItem('salesEntries')) || [];
    const expenseEntries = JSON.parse(localStorage.getItem('expenseEntries')) || [];
    const dieselEntries = JSON.parse(localStorage.getItem('dieselEntries')) || [];
    const repairEntries = JSON.parse(localStorage.getItem('repairEntries')) || [];
    const damageEntries = JSON.parse(localStorage.getItem('damageEntries')) || [];
    
    // Calculate global metrics
    const totalRevenue = calculateTotal(salesEntries, 'total_amount');
    const totalExpenses = calculateTotal(expenseEntries, 'amount');
    const netProfit = totalRevenue - totalExpenses;
    
    // Get user data
    const users = JSON.parse(localStorage.getItem('users')) || [
      { email: 'admin@starland.com', name: 'System Administrator', role: 'admin', status: 'active', last_login: 'Today, 10:30 AM' },
      { email: 'manager@starland.com', name: 'John Smith', role: 'management', status: 'active', last_login: 'Today, 9:45 AM' },
      { email: 'clerk1@starland.com', name: 'Sarah Johnson', role: 'entry', status: 'active', last_login: 'Yesterday, 4:20 PM' },
      { email: 'clerk2@starland.com', name: 'Michael Brown', role: 'entry', status: 'active', last_login: 'June 14, 2023' },
      { email: 'accountant@starland.com', name: 'Emily Davis', role: 'management', status: 'active', last_login: 'Today, 8:15 AM' }
    ];
    
    // Update KPI cards
    document.querySelectorAll('.kpi-value').forEach((el, index) => {
      switch(index) {
        case 0:
          el.textContent = `KSH ${totalRevenue.toLocaleString()}`;
          break;
        case 1:
          el.textContent = `KSH ${totalExpenses.toLocaleString()}`;
          break;
        case 2:
          el.textContent = `KSH ${netProfit.toLocaleString()}`;
          break;
        case 3:
          el.textContent = users.length;
          break;
      }
    });
  }
  
  // Update system status
  updateSystemStatus();
  
  // Update alerts
  updateSystemAlerts();
  
  // Update recent transactions
  updateRecentTransactions();
}

// Calculate total for a specific property
function calculateTotal(entries, property) {
  return entries.reduce((sum, entry) => sum + (entry[property] || 0), 0);
}

// Update system status indicators
function updateSystemStatus() {
  // In a real app, this would check actual system status
  // For demo, we'll just update the indicators
  const statusItems = document.querySelectorAll('.status-item');
  
  if (statusItems.length > 0) {
    statusItems[0].querySelector('.status-indicator').innerHTML = '<span class="status success">Operational</span>';
    statusItems[1].querySelector('.status-indicator').innerHTML = '<span class="status success">Operational</span>';
    statusItems[2].querySelector('.status-indicator').innerHTML = '<span class="status warning">Last backup: 2 hours ago</span>';
    statusItems[3].querySelector('.status-indicator').innerHTML = '<span class="status success">Clean</span>';
  }
}

// Update system alerts
function updateSystemAlerts() {
  // In a real app, this would fetch actual alerts
  // For demo, we'll just ensure the alerts are displayed
  const alertItems = document.querySelectorAll('.alert-item');
  
  // Add event listeners to alert items if needed
  alertItems.forEach(item => {
    if (!item.classList.contains('initialized')) {
      item.classList.add('initialized');
      // Add any interactivity here if needed
    }
  });
}

// Update recent transactions for admin dashboard
async function updateRecentTransactions() {
  try {
    // Fetch recent transactions from all transaction tables
    const salesResult = await window.supabaseClient.from('sales_transactions').select('created_at, created_by, created_by_name, receipt_number, total_amount').order('created_at', { ascending: false }).limit(5);
    const expenseResult = await window.supabaseClient.from('expense_transactions').select('created_at, created_by, created_by_name, expense_number, amount').order('created_at', { ascending: false }).limit(5);
    const dieselResult = await window.supabaseClient.from('diesel_transactions').select('created_at, created_by, created_by_name, transaction_number, total_cost').order('created_at', { ascending: false }).limit(5);
    const repairResult = await window.supabaseClient.from('repair_transactions').select('created_at, created_by, created_by_name, repair_number, cost').order('created_at', { ascending: false }).limit(5);
    const damageResult = await window.supabaseClient.from('damage_transactions').select('created_at, created_by, created_by_name, damage_number, estimated_value').order('created_at', { ascending: false }).limit(5);
    
    // Combine and sort all transactions by timestamp
    let allTransactions = [];
    
    if (!salesResult.error) {
      allTransactions = allTransactions.concat(salesResult.data.map(item => ({
        timestamp: item.created_at,
        user: item.created_by_name || item.created_by,
        type: 'Sales',
        reference: item.receipt_number,
        amount: item.total_amount,
        status: 'Completed'
      })));
    }
    
    if (!expenseResult.error) {
      allTransactions = allTransactions.concat(expenseResult.data.map(item => ({
        timestamp: item.created_at,
        user: item.created_by_name || item.created_by,
        type: 'Expense',
        reference: item.expense_number,
        amount: item.amount,
        status: 'Completed'
      })));
    }
    
    if (!dieselResult.error) {
      allTransactions = allTransactions.concat(dieselResult.data.map(item => ({
        timestamp: item.created_at,
        user: item.created_by_name || item.created_by,
        type: 'Diesel',
        reference: item.transaction_number,
        amount: item.total_cost,
        status: 'Completed'
      })));
    }
    
    if (!repairResult.error) {
      allTransactions = allTransactions.concat(repairResult.data.map(item => ({
        timestamp: item.created_at,
        user: item.created_by_name || item.created_by,
        type: 'Repair',
        reference: item.repair_number,
        amount: item.cost,
        status: 'Completed'
      })));
    }
    
    if (!damageResult.error) {
      allTransactions = allTransactions.concat(damageResult.data.map(item => ({
        timestamp: item.created_at,
        user: item.created_by_name || item.created_by,
        type: 'Damage',
        reference: item.damage_number,
        amount: item.estimated_value,
        status: 'Reported'
      })));
    }
    
    // Sort by timestamp (most recent first)
    allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Take only the 10 most recent transactions
    const recentTransactions = allTransactions.slice(0, 10);
    
    const tbody = document.querySelector('#recentTransactionsTable tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    if (recentTransactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="no-data-message">No recent transactions found</td></tr>';
      return;
    }
    
    recentTransactions.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateTimeString = `${dateString} ${timeString}`;
      const userDisplay = transaction.user || 'Unknown User';
      const amountFormatted = transaction.amount ? `KSH ${transaction.amount.toLocaleString()}` : 'N/A';
      
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${dateTimeString}</td>
        <td>${userDisplay}</td>
        <td>${transaction.type}</td>
        <td>${transaction.reference || 'N/A'}</td>
        <td>${amountFormatted}</td>
        <td><span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
      `;
      
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading recent transactions:', error);
    
    // Fallback to localStorage data if database fails
    const salesEntries = JSON.parse(localStorage.getItem('salesEntries')) || [];
    const expenseEntries = JSON.parse(localStorage.getItem('expenseEntries')) || [];
    const dieselEntries = JSON.parse(localStorage.getItem('dieselEntries')) || [];
    const repairEntries = JSON.parse(localStorage.getItem('repairEntries')) || [];
    const damageEntries = JSON.parse(localStorage.getItem('damageEntries')) || [];
    
    // Combine and sort all transactions by timestamp
    let allTransactions = [];
    
    // Process sales entries
    salesEntries.forEach(item => {
      allTransactions.push({
        timestamp: item.created_at || item.date,
        user: item.created_by_name || item.created_by || 'Local User',
        type: 'Sales',
        reference: item.receipt_number,
        amount: item.total_amount || item.amount,
        status: 'Completed'
      });
    });
    
    // Process expense entries
    expenseEntries.forEach(item => {
      allTransactions.push({
        timestamp: item.created_at || item.date,
        user: item.created_by_name || item.created_by || 'Local User',
        type: 'Expense',
        reference: item.expense_number,
        amount: item.amount,
        status: 'Completed'
      });
    });
    
    // Process diesel entries
    dieselEntries.forEach(item => {
      allTransactions.push({
        timestamp: item.created_at || item.date,
        user: item.created_by_name || item.created_by || 'Local User',
        type: 'Diesel',
        reference: item.transaction_number,
        amount: item.total_cost || item.amount,
        status: 'Completed'
      });
    });
    
    // Process repair entries
    repairEntries.forEach(item => {
      allTransactions.push({
        timestamp: item.created_at || item.date,
        user: item.created_by_name || item.created_by || 'Local User',
        type: 'Repair',
        reference: item.repair_number,
        amount: item.cost,
        status: 'Completed'
      });
    });
    
    // Process damage entries
    damageEntries.forEach(item => {
      allTransactions.push({
        timestamp: item.created_at || item.date,
        user: item.created_by_name || item.created_by || 'Local User',
        type: 'Damage',
        reference: item.damage_number,
        amount: item.estimated_value || item.amount,
        status: 'Reported'
      });
    });
    
    // Sort by timestamp (most recent first)
    allTransactions.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
    
    // Take only the 10 most recent transactions
    const recentTransactions = allTransactions.slice(0, 10);
    
    const tbody = document.querySelector('#recentTransactionsTable tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    if (recentTransactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="no-data-message">No recent transactions found</td></tr>';
      return;
    }
    
    recentTransactions.forEach(transaction => {
      const date = new Date(transaction.timestamp || transaction.date);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateTimeString = `${dateString} ${timeString}`;
      const userDisplay = transaction.user || 'Unknown User';
      const amountFormatted = transaction.amount ? `KSH ${transaction.amount.toLocaleString()}` : 'N/A';
      
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${dateTimeString}</td>
        <td>${userDisplay}</td>
        <td>${transaction.type}</td>
        <td>${transaction.reference || 'N/A'}</td>
        <td>${amountFormatted}</td>
        <td><span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
      `;
      
      tbody.appendChild(row);
    });
  }
}

// Initialize admin charts
function initializeAdminCharts() {
  // Placeholder for admin-specific charts
  console.log('Admin charts initialized');
}

// Set up system monitoring
function setupSystemMonitoring() {
  // In a real app, this would set up periodic checks
  // For demo, we'll just log the setup
  console.log('System monitoring initialized');
  
  // Set up auto-refresh
  setInterval(loadAdminDashboardData, 60000); // Refresh every minute
}

// Initialize user management
function initializeUserManagement() {
  loadUsers();
  setupUserManagementEvents();
  initializeUserModal();
}

// Load users from storage
async function loadUsers() {
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
}

// Render users in the table
function renderUsers(users) {
  const tbody = document.querySelector('.data-table tbody');
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
        <button class="btn btn-sm btn-secondary edit-user" data-user-id="${user.id}">Edit</button>
        <button class="btn btn-sm btn-danger toggle-user" data-user-id="${user.id}" data-status="${user.status}">
          ${user.status === 'active' ? 'Disable' : 'Enable'}
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Add event listeners to edit and toggle buttons
  document.querySelectorAll('.edit-user').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      openEditUserModal(userId);
    });
  });
  
  document.querySelectorAll('.toggle-user').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-user-id');
      toggleUserStatus(userId);
    });
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

// Set up user management events
function setupUserManagementEvents() {
  // Add new user button
  const addUserBtn = document.getElementById('addUserBtn');
  if (addUserBtn) {
    addUserBtn.addEventListener('click', function() {
      openAddUserModal();
    });
  }
  
  // Search and filter
  const searchInput = document.querySelector('.search-input');
  const filterSelect = document.querySelector('.filter-select');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterUsers();
    });
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', function() {
      filterUsers();
    });
  }
}

// Filter users based on search and selection
function filterUsers() {
  const searchTerm = document.querySelector('.search-input').value.toLowerCase();
  const roleFilter = document.querySelector('.filter-select').value;
  
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Apply filters
  if (searchTerm) {
    users = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) || 
      user.name.toLowerCase().includes(searchTerm)
    );
  }
  
  if (roleFilter && roleFilter !== 'all') {
    users = users.filter(user => user.role === roleFilter);
  }
  
  renderUsers(users);
}

// Initialize user modal
function initializeUserModal() {
  const modal = document.getElementById('userModal');
  const closeBtn = document.querySelector('.close');
  const cancelBtn = document.getElementById('cancelBtn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      closeModal();
    });
  }
  
  // Close modal when clicking outside of it
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
  
  // Save user button
  const saveUserBtn = document.getElementById('saveUserBtn');
  if (saveUserBtn) {
    saveUserBtn.addEventListener('click', function() {
      saveUser();
    });
  }
}

// Open add user modal
function openAddUserModal() {
  document.getElementById('modalTitle').textContent = 'Add New User';
  document.getElementById('userForm').reset();
  
  // Clear any existing user ID
  document.getElementById('userForm').removeAttribute('data-user-id');
  
  // Show modal
  document.getElementById('userModal').style.display = 'block';
}

// Open edit user modal
function openEditUserModal(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.id == userId);
  
  if (!user) return;
  
  // Populate form with user data
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userName').value = user.name;
  document.getElementById('userRole').value = user.role;
  document.getElementById('userStatus').value = user.status;
  
  // Set form attribute to indicate edit mode
  document.getElementById('userForm').setAttribute('data-user-id', user.id);
  
  // Update modal title
  document.getElementById('modalTitle').textContent = 'Edit User';
  
  // Show modal
  document.getElementById('userModal').style.display = 'block';
}

// Save user (create or update)
async function saveUser() {
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
  closeModal();
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
  
  if (!['admin', 'management', 'entry'].includes(userData.role)) {
    alert('Please select a valid role');
    return false;
  }
  
  return true;
}

// Toggle user status
async function toggleUserStatus(userId) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id == userId);
  
  if (userIndex === -1) {
    alert('User not found');
    return;
  }
  
  // Toggle status
  users[userIndex].status = users[userIndex].status === 'active' ? 'inactive' : 'active';
  
  // Update button text
  const toggleBtn = document.querySelector(`.toggle-user[data-user-id="${userId}"]`);
  toggleBtn.textContent = users[userIndex].status === 'active' ? 'Disable' : 'Enable';
  
  // Update status badge
  const statusBadge = toggleBtn.parentElement.parentElement.querySelector('.status');
  statusBadge.className = `status ${users[userIndex].status === 'active' ? 'success' : 'warning'}`;
  statusBadge.textContent = users[userIndex].status.charAt(0).toUpperCase() + users[userIndex].status.slice(1);
  
  // Save updated users
  localStorage.setItem('users', JSON.stringify(users));
  
  alert(`User ${users[userIndex].status === 'active' ? 'enabled' : 'disabled'} successfully!`);
}

// Close modal
function closeModal() {
  document.getElementById('userModal').style.display = 'none';
}

// Initialize audit logs
function initializeAuditLogs() {
  loadAuditLogs();
  setupAuditFilters();
}

// Load audit logs from storage
async function loadAuditLogs() {
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
  const tbody = document.querySelector('.data-table tbody');
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

// Set up audit filters
function setupAuditFilters() {
  // Apply filters button
  const applyFiltersBtn = document.querySelector('.audit-filters .btn-secondary');
  if (applyFiltersBtn && applyFiltersBtn.textContent === 'Apply Filters') {
    applyFiltersBtn.addEventListener('click', function() {
      applyAuditFilters();
    });
  }
  
  // Export logs button
  const exportLogsBtn = document.querySelector('.table-actions .btn-secondary');
  if (exportLogsBtn && exportLogsBtn.textContent === 'Export Logs') {
    exportLogsBtn.addEventListener('click', function() {
      exportAuditLogs();
    });
  }
  
  // Clear logs button
  const clearLogsBtn = document.querySelector('.table-actions .btn-danger');
  if (clearLogsBtn && clearLogsBtn.textContent === 'Clear Logs') {
    clearLogsBtn.addEventListener('click', function() {
      clearAuditLogs();
    });
  }
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
      `"${log.timestamp}"`,
      `"${log.user}"`,
      `"${log.action}"`,
      `"${log.module}"`,
      `"${log.details}"`,
      `"${log.ip_address}"`,
      `"${log.status}"`
    ].join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
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

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES', // Kenyan Shilling
    minimumFractionDigits: 2
  }).format(amount);
}

// Refresh data periodically
function refreshAdminData() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/admin/dashboard.html')) {
    loadAdminDashboardData();
    updateRecentTransactions();
  } else if (currentPath.includes('/admin/users.html')) {
    loadUsers();
  } else if (currentPath.includes('/admin/audit.html')) {
    loadAuditLogs();
  }
}

// Set up auto-refresh
setInterval(refreshAdminData, 300000); // Refresh every 5 minutes