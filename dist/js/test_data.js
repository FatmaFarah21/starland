/**
 * Test data creation script for Starland Water Company System
 * Creates sample data to ensure admin dashboard displays information properly
 */

// Function to create test data for demonstration
async function createTestData() {
  console.log('Creating test data for Starland Water Company System...');
  
  // Check if Supabase client is available
  if (!window.supabaseClient) {
    console.error('Supabase client not available. Please ensure supabase.js is loaded.');
    return;
  }
  
  try {
    // Create test sales data
    const testSales = [
      {
        receipt_number: 'SAL-2023-001',
        date: new Date().toISOString().split('T')[0],
        customer_name: 'ABC Company Ltd',
        contact_info: 'contact@abccompany.com',
        product_type: 'drum',
        quantity: 5,
        unit_price: 3000,
        total_amount: 15000,
        payment_method: 'Cash',
        notes: 'Bulk order for construction site',
        created_at: new Date().toISOString(),
        created_by: 'admin@starland.com',
        created_by_name: 'System Administrator'
      },
      {
        receipt_number: 'SAL-2023-002',
        date: new Date().toISOString().split('T')[0],
        customer_name: 'XYZ Enterprises',
        contact_info: 'orders@xyzent.com',
        product_type: 'jerrycan',
        quantity: 20,
        unit_price: 500,
        total_amount: 10000,
        payment_method: 'M-Pesa',
        notes: 'Regular monthly order',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        created_by: 'manager@starland.com',
        created_by_name: 'John Smith'
      }
    ];
    
    // Insert test sales data
    for (const sale of testSales) {
      try {
        const { error } = await window.supabaseClient.from('sales_transactions').insert(sale);
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.warn(`Warning inserting sale ${sale.receipt_number}:`, error.message);
        } else if (!error) {
          console.log(`✓ Inserted sale: ${sale.receipt_number}`);
        }
      } catch (e) {
        console.warn(`Could not insert sale ${sale.receipt_number}:`, e.message);
      }
    }
    
    // Create test expense data
    const testExpenses = [
      {
        expense_number: 'EXP-2023-001',
        date: new Date().toISOString().split('T')[0],
        vendor: 'Fuel Station Ltd',
        category: 'Transportation',
        description: 'Diesel fuel for delivery truck',
        amount: 8500,
        payment_method: 'Cash',
        notes: 'Monthly fuel refill',
        created_at: new Date().toISOString(),
        created_by: 'manager@starland.com',
        created_by_name: 'John Smith'
      },
      {
        expense_number: 'EXP-2023-002',
        date: new Date().toISOString().split('T')[0],
        vendor: 'Maintenance Co',
        category: 'Repairs',
        description: 'Truck engine overhaul',
        amount: 25000,
        payment_method: 'Bank Transfer',
        notes: 'Annual maintenance service',
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        created_by: 'admin@starland.com',
        created_by_name: 'System Administrator'
      }
    ];
    
    // Insert test expense data
    for (const expense of testExpenses) {
      try {
        const { error } = await window.supabaseClient.from('expense_transactions').insert(expense);
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.warn(`Warning inserting expense ${expense.expense_number}:`, error.message);
        } else if (!error) {
          console.log(`✓ Inserted expense: ${expense.expense_number}`);
        }
      } catch (e) {
        console.warn(`Could not insert expense ${expense.expense_number}:`, e.message);
      }
    }
    
    // Create test diesel data
    const testDiesel = [
      {
        transaction_number: 'DSL-2023-001',
        date: new Date().toISOString().split('T')[0],
        supplier: 'Petrol Plus',
        liters: 200,
        unit_price: 130,
        total_cost: 26000,
        vehicle_number: 'KBA 123A',
        driver_name: 'James Omondi',
        odometer_start: 45600,
        odometer_end: 45800,
        notes: 'Monthly fuel allocation',
        created_at: new Date().toISOString(),
        created_by: 'clerk@starland.com',
        created_by_name: 'Sarah Johnson'
      }
    ];
    
    // Insert test diesel data
    for (const diesel of testDiesel) {
      try {
        const { error } = await window.supabaseClient.from('diesel_transactions').insert(diesel);
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.warn(`Warning inserting diesel ${diesel.transaction_number}:`, error.message);
        } else if (!error) {
          console.log(`✓ Inserted diesel: ${diesel.transaction_number}`);
        }
      } catch (e) {
        console.warn(`Could not insert diesel ${diesel.transaction_number}:`, e.message);
      }
    }
    
    // Create test repair data
    const testRepairs = [
      {
        repair_number: 'RPR-2023-001',
        date: new Date().toISOString().split('T')[0],
        vehicle_number: 'KBA 123A',
        repair_type: 'Engine',
        description: 'Oil change and filter replacement',
        cost: 5000,
        vendor: 'Auto Care Workshop',
        notes: 'Scheduled maintenance',
        created_at: new Date().toISOString(),
        created_by: 'manager@starland.com',
        created_by_name: 'John Smith'
      }
    ];
    
    // Insert test repair data
    for (const repair of testRepairs) {
      try {
        const { error } = await window.supabaseClient.from('repair_transactions').insert(repair);
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.warn(`Warning inserting repair ${repair.repair_number}:`, error.message);
        } else if (!error) {
          console.log(`✓ Inserted repair: ${repair.repair_number}`);
        }
      } catch (e) {
        console.warn(`Could not insert repair ${repair.repair_number}:`, e.message);
      }
    }
    
    // Create test damage data
    const testDamages = [
      {
        damage_number: 'DMG-2023-001',
        date: new Date().toISOString().split('T')[0],
        asset_type: 'Vehicle',
        asset_id: 'KBA 123A',
        description: 'Minor dent on rear bumper',
        severity: 'Low',
        estimated_value: 15000,
        repair_required: 'Yes',
        notes: 'Accident during delivery',
        created_at: new Date().toISOString(),
        created_by: 'driver@starland.com',
        created_by_name: 'James Omondi'
      }
    ];
    
    // Insert test damage data
    for (const damage of testDamages) {
      try {
        const { error } = await window.supabaseClient.from('damage_transactions').insert(damage);
        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.warn(`Warning inserting damage ${damage.damage_number}:`, error.message);
        } else if (!error) {
          console.log(`✓ Inserted damage: ${damage.damage_number}`);
        }
      } catch (e) {
        console.warn(`Could not insert damage ${damage.damage_number}:`, e.message);
      }
    }
    
    console.log('✓ Test data creation completed!');
    console.log('The admin dashboard should now show recent transactions from data entry.');
    
  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

// Auto-run when DOM is loaded if on admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure all scripts are loaded
  setTimeout(function() {
    console.log('Test data script running on:', window.location.pathname);
    
    // Run on admin dashboard
    if (window.location.pathname.includes('/admin/dashboard.html')) {
      console.log('Running test data creation for admin dashboard...');
      createTestData();
    }
    
    // Also run on any data entry page to ensure we have data
    if (window.location.pathname.includes('/entry/')) {
      console.log('On data entry page, will populate sample data after delay...');
      // Wait a bit more on entry pages to allow user interaction
      setTimeout(createTestData, 5000);
    }
  }, 2000);
});

console.log('Test data script loaded. Will run automatically on admin dashboard.');