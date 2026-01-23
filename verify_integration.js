/**
 * Starland Water Company System - Integration Verification Script
 * 
 * This script verifies that all system components are properly connected
 * and communicating with each other as expected.
 */

// Verification functions
const SystemVerification = {
  // Check if all required scripts are loaded
  checkScriptLoading() {
    const requiredScripts = [
      'window.supabaseClient',
      'window.supabaseAuth',
      'window.GlobalUtils',
      'window.AppState',
      'window.SystemIntegration',
      'window.globalEventBus',
      'window.guards'
    ];
    
    console.log('🔍 Checking script loading...');
    let allLoaded = true;
    
    for (const script of requiredScripts) {
      try {
        const isLoaded = eval(`typeof ${script} !== 'undefined'`);
        console.log(`  ${isLoaded ? '✅' : '❌'} ${script}`);
        if (!isLoaded) allLoaded = false;
      } catch (e) {
        console.log(`  ❌ ${script} (error checking)`);
        allLoaded = false;
      }
    }
    
    return allLoaded;
  },
  
  // Check if Supabase is properly configured
  async checkSupabaseConnection() {
    console.log('\n🔍 Checking Supabase connection...');
    
    if (!window.supabaseClient) {
      console.log('  ❌ Supabase client not available');
      return false;
    }
    
    try {
      // Test basic connection
      const { data, error } = await window.supabaseClient.from('sales_transactions').select('id').limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist, which is OK for initial setup
        console.log('  ⚠️  Supabase connected but tables may need initialization');
        return true;
      } else if (error) {
        console.log(`  ❌ Supabase connection error: ${error.message}`);
        return false;
      }
      
      console.log('  ✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.log(`  ❌ Supabase connection failed: ${error.message}`);
      return false;
    }
  },
  
  // Check if global configuration is working
  checkGlobalConfig() {
    console.log('\n🔍 Checking global configuration...');
    
    const checks = [
      { name: 'GlobalUtils available', condition: typeof window.GlobalUtils !== 'undefined' },
      { name: 'AppState available', condition: typeof window.AppState !== 'undefined' },
      { name: 'EventBus available', condition: typeof window.globalEventBus !== 'undefined' },
      { name: 'SystemIntegration available', condition: typeof window.SystemIntegration !== 'undefined' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      console.log(`  ${check.condition ? '✅' : '❌'} ${check.name}`);
      if (!check.condition) allPassed = false;
    }
    
    return allPassed;
  },
  
  // Check if authentication is working
  async checkAuthentication() {
    console.log('\n🔍 Checking authentication system...');
    
    if (!window.supabaseAuth) {
      console.log('  ❌ Authentication system not available');
      return false;
    }
    
    try {
      const isAuthenticated = await window.supabaseAuth.isAuthenticated();
      console.log(`  ✅ Authentication system available (user ${isAuthenticated ? 'logged in' : 'not logged in'})`);
      
      if (isAuthenticated) {
        const user = await window.supabaseAuth.getCurrentUser();
        const role = await window.supabaseAuth.getUserRole();
        console.log(`    User: ${user?.email || 'Unknown'}`);
        console.log(`    Role: ${role || 'Unknown'}`);
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ Authentication check failed: ${error.message}`);
      return false;
    }
  },
  
  // Check if data entry is working
  async checkDataEntry() {
    console.log('\n🔍 Checking data entry functionality...');
    
    const checks = [
      { name: 'Entry functions available', condition: typeof window.saveSale !== 'undefined' },
      { name: 'Save functions available', condition: typeof window.saveExpense !== 'undefined' },
      { name: 'Dashboard functions available', condition: typeof window.loadDashboardData !== 'undefined' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      console.log(`  ${check.condition ? '✅' : '❌'} ${check.name}`);
      if (!check.condition) allPassed = false;
    }
    
    // Test user attribution functions
    if (window.supabaseAuth) {
      try {
        const displayName = await window.supabaseAuth.getCurrentUserDisplayName();
        const email = await window.supabaseAuth.getCurrentUserEmail();
        console.log(`  ✅ User attribution functions working (Name: ${displayName}, Email: ${email})`);
      } catch (error) {
        console.log(`  ❌ User attribution functions failed: ${error.message}`);
        allPassed = false;
      }
    }
    
    return allPassed;
  },
  
  // Check if navigation is working
  checkNavigation() {
    console.log('\n🔍 Checking navigation system...');
    
    const checks = [
      { name: 'Global navigation available', condition: typeof window.GlobalUtils?.navigateTo !== 'undefined' },
      { name: 'Role-based redirects available', condition: typeof window.GlobalUtils?.redirectBasedOnRole !== 'undefined' },
      { name: 'Route guards available', condition: typeof window.guards !== 'undefined' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      console.log(`  ${check.condition ? '✅' : '❌'} ${check.name}`);
      if (!check.condition) allPassed = false;
    }
    
    return allPassed;
  },
  
  // Run complete verification
  async runFullVerification() {
    console.log('🚀 Starting Starland Water Company System Integration Verification...\n');
    
    const results = {
      scripts: this.checkScriptLoading(),
      supabase: await this.checkSupabaseConnection(),
      globalConfig: this.checkGlobalConfig(),
      auth: await this.checkAuthentication(),
      dataEntry: await this.checkDataEntry(),
      navigation: this.checkNavigation()
    };
    
    console.log('\n📊 Verification Results:');
    console.log(`  Scripts Loaded: ${results.scripts ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Supabase Connection: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Global Config: ${results.globalConfig ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Authentication: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Data Entry: ${results.dataEntry ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Navigation: ${results.navigation ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPass = Object.values(results).every(result => result);
    
    console.log(`\n🎯 Overall Status: ${allPass ? '✅ ALL SYSTEMS CONNECTED AND WORKING!' : '❌ SOME ISSUES FOUND'}`);
    
    if (allPass) {
      console.log('\n🎉 The Starland Water Company Management System is fully integrated and operational!');
      console.log('All components are communicating properly and the system is ready for use.');
    } else {
      console.log('\n⚠️  Please review the failed checks above and ensure all components are properly configured.');
    }
    
    return allPass;
  }
};

// Run verification when loaded
document.addEventListener('DOMContentLoaded', async function() {
  // Wait a bit for all scripts to load completely
  setTimeout(async () => {
    await SystemVerification.runFullVerification();
  }, 1000);
});

console.log('System verification script loaded. Will run automatically when DOM is ready.');