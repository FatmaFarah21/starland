/**
 * Troubleshooting script for Starland Water Company System
 * Helps diagnose issues with admin dashboard not showing data
 */

// Function to run diagnostics
async function runDiagnostics() {
  console.log('🔍 Running diagnostics for Starland Water Company System...');
  
  // 1. Check if Supabase client is available
  console.log('\n1. Checking Supabase client availability...');
  if (window.supabaseClient) {
    console.log('✅ Supabase client is available');
  } else {
    console.error('❌ Supabase client is NOT available');
    console.log('   Make sure supabase.js is loaded before other scripts');
    return false;
  }
  
  // 2. Check if required functions exist
  console.log('\n2. Checking required functions...');
  const requiredFunctions = [
    'updateRecentTransactions',
    'loadAdminDashboardData'
  ];
  
  for (const funcName of requiredFunctions) {
    if (typeof window[funcName] === 'function') {
      console.log(`✅ ${funcName} function exists`);
    } else {
      console.error(`❌ ${funcName} function is missing`);
    }
  }
  
  // 3. Check if we're on the admin dashboard
  console.log('\n3. Checking current page...');
  const isAdminDashboard = window.location.pathname.includes('/admin/dashboard.html');
  console.log(`Current path: ${window.location.pathname}`);
  console.log(`Is admin dashboard: ${isAdminDashboard}`);
  
  if (!isAdminDashboard) {
    console.log('⚠️  Not on admin dashboard - this script is meant to run on admin/dashboard.html');
  }
  
  // 4. Check if the target table exists
  console.log('\n4. Checking for recent transactions table...');
  const transactionTable = document.querySelector('#recentTransactionsTable');
  if (transactionTable) {
    console.log('✅ Recent transactions table found');
  } else {
    console.error('❌ Recent transactions table NOT found');
    console.log('   Expected element with ID: recentTransactionsTable');
    console.log('   Current elements with class "data-table":');
    document.querySelectorAll('.data-table').forEach((table, index) => {
      console.log(`   - Table ${index}: ID="${table.id}", Class="${table.className}"`);
    });
  }
  
  // 5. Test database connection
  console.log('\n5. Testing database connection...');
  try {
    // Try to fetch a few records from one of the tables
    const testResult = await window.supabaseClient.from('sales_transactions').select('*').limit(1);
    if (testResult.error) {
      console.log(`⚠️  Database connection issue: ${testResult.error.message}`);
      console.log('   This might be because the table doesn\'t exist yet');
    } else {
      console.log('✅ Database connection working');
      console.log(`   Found ${testResult.data.length} sales records`);
    }
  } catch (error) {
    console.error(`❌ Database test failed: ${error.message}`);
  }
  
  // 6. Check localStorage data
  console.log('\n6. Checking localStorage data...');
  const localStorageKeys = ['salesEntries', 'expenseEntries', 'dieselEntries', 'repairEntries', 'damageEntries'];
  for (const key of localStorageKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      console.log(`✅ ${key}: ${parsed.length} entries`);
    } else {
      console.log(`⚠️  ${key}: No data found`);
    }
  }
  
  // 7. Manual trigger of update function
  console.log('\n7. Manually triggering updateRecentTransactions...');
  if (typeof updateRecentTransactions === 'function') {
    try {
      await updateRecentTransactions();
      console.log('✅ updateRecentTransactions executed successfully');
    } catch (error) {
      console.error(`❌ updateRecentTransactions failed: ${error.message}`);
    }
  } else {
    console.error('❌ updateRecentTransactions function not found');
  }
  
  console.log('\n📋 Diagnostics complete!');
  console.log('💡 If issues persist, check the browser console for errors when the page loads.');
  console.log('💡 Make sure your Supabase project is configured correctly in js/supabase.js');
}

// Run diagnostics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure all scripts are loaded
  setTimeout(runDiagnostics, 1000);
});

// Also make it available globally for manual execution
window.runDiagnostics = runDiagnostics;

console.log('🔧 Troubleshooting script loaded. Run "runDiagnostics()" in console to execute manually.');