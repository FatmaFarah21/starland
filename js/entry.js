// Handle diesel form submission
async function handleDieselSubmission(form) {
  const formData = new FormData(form);
  const dieselData = {
    transaction_number: formData.get('dieselNumber'),
    date: formData.get('dieselDate'),
    supplier: formData.get('supplier'),
    liters: parseFloat(formData.get('liters')),
    unit_price: parseFloat(formData.get('unitPrice')),
    total_cost: parseFloat(formData.get('totalCost')),
    vehicle: formData.get('vehicle'),
    driver: formData.get('driver'),
    payment_method: formData.get('paymentMethod'),
    notes: formData.get('notes'),
    created_at: new Date().toISOString(),
    created_by: await window.supabaseAuth.getCurrentUserEmail(),
    created_by_name: await window.supabaseAuth.getCurrentUserDisplayName()
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Saving...';
  submitButton.disabled = true;
  
  try {
    await saveDieselEntry(dieselData);
    
    alert('Diesel purchase recorded successfully!');
    
    // Reset form
    form.reset();
    setDefaultDate();
    generateAutoIds();
    calculateTotalCost(); // Recalculate if needed
    
  } catch (error) {
    console.error('Error saving diesel entry:', error);
    alert('Error saving diesel purchase. Please try again.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Save diesel entry to Supabase database
async function saveDieselEntry(dieselData) {
  try {
    // Save to Supabase database
    const { data, error } = await window.supabaseClient.from('diesel_transactions').insert([dieselData]);
    
    if (error) {
      console.error('Error saving diesel entry to Supabase:', error);
      throw error;
    }
    
    // Also save to localStorage as fallback
    let dieselEntries = JSON.parse(localStorage.getItem('dieselEntries') || '[]');
    dieselEntries.push(dieselData);
    localStorage.setItem('dieselEntries', JSON.stringify(dieselEntries));
  } catch (error) {
    console.error('Error in saveDieselEntry:', error);
    // Fallback to localStorage only if Supabase fails
    let dieselEntries = JSON.parse(localStorage.getItem('dieselEntries') || '[]');
    dieselEntries.push(dieselData);
    localStorage.setItem('dieselEntries', JSON.stringify(dieselEntries));
    
    // Optionally show user feedback about the error
    alert('Data saved locally, but failed to sync to cloud. Please check your connection.');
  }
}

// Initialize repairs form
function initializeRepairsForm() {
  const repairsForm = document.getElementById('repairsForm');
  
  if (repairsForm) {
    // Set up form submission
    repairsForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await handleRepairsSubmission(repairsForm);
    });
  }
}

// Handle repairs form submission
async function handleRepairsSubmission(form) {
  const formData = new FormData(form);
  const repairData = {
    repair_number: formData.get('repairNumber'),
    date: formData.get('repairDate'),
    equipment: formData.get('equipment'),
    repair_type: formData.get('repairType'),
    problem_description: formData.get('problemDescription'),
    cost: parseFloat(formData.get('cost')),
    repair_shop: formData.get('repairShop'),
    technician: formData.get('technician'),
    payment_method: formData.get('paymentMethod'),
    notes: formData.get('notes'),
    created_at: new Date().toISOString(),
    created_by: await window.supabaseAuth.getCurrentUserEmail(),
    created_by_name: await window.supabaseAuth.getCurrentUserDisplayName()
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Saving...';
  submitButton.disabled = true;
  
  try {
    await saveRepairEntry(repairData);
    
    alert('Repair recorded successfully!');
    
    // Reset form
    form.reset();
    setDefaultDate();
    generateAutoIds();
    
  } catch (error) {
    console.error('Error saving repair entry:', error);
    alert('Error saving repair. Please try again.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Save repair entry to Supabase database
async function saveRepairEntry(repairData) {
  try {
    // Save to Supabase database
    const { data, error } = await window.supabaseClient.from('repair_transactions').insert([repairData]);
    
    if (error) {
      console.error('Error saving repair entry to Supabase:', error);
      throw error;
    }
    
    // Also save to localStorage as fallback
    let repairEntries = JSON.parse(localStorage.getItem('repairEntries') || '[]');
    repairEntries.push(repairData);
    localStorage.setItem('repairEntries', JSON.stringify(repairEntries));
  } catch (error) {
    console.error('Error in saveRepairEntry:', error);
    // Fallback to localStorage only if Supabase fails
    let repairEntries = JSON.parse(localStorage.getItem('repairEntries') || '[]');
    repairEntries.push(repairData);
    localStorage.setItem('repairEntries', JSON.stringify(repairEntries));
    
    // Optionally show user feedback about the error
    alert('Data saved locally, but failed to sync to cloud. Please check your connection.');
  }
}

// Initialize damages form
function initializeDamagesForm() {
  const damagesForm = document.getElementById('damagesForm');
  
  if (damagesForm) {
    // Set up form submission
    damagesForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await handleDamagesSubmission(damagesForm);
    });
  }
}

// Handle damages form submission
async function handleDamagesSubmission(form) {
  const formData = new FormData(form);
  const damageData = {
    damage_number: formData.get('damageNumber'),
    date: formData.get('damageDate'),
    item_type: formData.get('itemType'),
    item_name: formData.get('itemName'),
    damage_cause: formData.get('damageCause'),
    estimated_value: parseFloat(formData.get('estimatedValue')),
    severity: formData.get('severity'),
    responsible_party: formData.get('responsibleParty'),
    description: formData.get('description'),
    notes: formData.get('notes'),
    created_at: new Date().toISOString(),
    created_by: await window.supabaseAuth.getCurrentUserEmail(),
    created_by_name: await window.supabaseAuth.getCurrentUserDisplayName()
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Saving...';
  submitButton.disabled = true;
  
  try {
    await saveDamageEntry(damageData);
    
    alert('Damage recorded successfully!');
    
    // Reset form
    form.reset();
    setDefaultDate();
    generateAutoIds();
    
  } catch (error) {
    console.error('Error saving damage entry:', error);
    alert('Error saving damage. Please try again.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Save damage entry to Supabase database
async function saveDamageEntry(damageData) {
  try {
    // Save to Supabase database
    const { data, error } = await window.supabaseClient.from('damage_transactions').insert([damageData]);
    
    if (error) {
      console.error('Error saving damage entry to Supabase:', error);
      throw error;
    }
    
    // Also save to localStorage as fallback
    let damageEntries = JSON.parse(localStorage.getItem('damageEntries') || '[]');
    damageEntries.push(damageData);
    localStorage.setItem('damageEntries', JSON.stringify(damageEntries));
  } catch (error) {
    console.error('Error in saveDamageEntry:', error);
    // Fallback to localStorage only if Supabase fails
    let damageEntries = JSON.parse(localStorage.getItem('damageEntries') || '[]');
    damageEntries.push(damageData);
    localStorage.setItem('damageEntries', JSON.stringify(damageEntries));
    
    // Optionally show user feedback about the error
    alert('Data saved locally, but failed to sync to cloud. Please check your connection.');
  }
}

// Utility function to validate form fields
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      // Add error styling
      field.style.borderColor = '#ef4444';
    } else {
      // Remove error styling
      field.style.borderColor = '#cbd5e1';
    }
  });
  
  return isValid;
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

// Set default date to today for date inputs
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = today;
    }
  });
}

// Function kept for potential future use but currently not generating auto IDs
function generateAutoIds() {
  // Currently not auto-generating IDs as manual entry is preferred
  // This function can be modified if auto-generation is needed in the future
}

// Initialize form when page loads
function initializeForm() {
  setDefaultDate();
  generateAutoIds();
}

// Set up form initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeForm);
} else {
  initializeForm();
}

// Set up form submission handlers
function setupFormHandlers() {
  // Sales form
  const salesForm = document.getElementById('salesForm');
  if (salesForm) {
    salesForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await handleSalesSubmission(salesForm);
    });
    
    // Set up quantity and price calculation
    const quantityInput = document.getElementById('quantity');
    const unitPriceInput = document.getElementById('unitPrice');
    const totalAmountInput = document.getElementById('totalAmount');
    
    if (quantityInput && unitPriceInput && totalAmountInput) {
      function calculateTotal() {
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        totalAmountInput.value = (quantity * unitPrice).toFixed(2);
      }
      
      quantityInput.addEventListener('input', calculateTotal);
      unitPriceInput.addEventListener('input', calculateTotal);
    }
  }
  
  // Expenses form
  const expensesForm = document.getElementById('expensesForm');
  if (expensesForm) {
    expensesForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await handleExpensesSubmission(expensesForm);
    });
  }
  
  // Diesel form
  const dieselForm = document.getElementById('dieselForm');
  if (dieselForm) {
    dieselForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await handleDieselSubmission(dieselForm);
    });
    
    // Set up diesel cost calculation
    const litersInput = document.getElementById('liters');
    const unitPriceInputDiesel = document.getElementById('unitPrice');
    const totalCostInput = document.getElementById('totalCost');
    
    if (litersInput && unitPriceInputDiesel && totalCostInput) {
      function calculateTotalCost() {
        const liters = parseFloat(litersInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInputDiesel.value) || 0;
        totalCostInput.value = (liters * unitPrice).toFixed(2);
      }
      
      litersInput.addEventListener('input', calculateTotalCost);
      unitPriceInputDiesel.addEventListener('input', calculateTotalCost);
    }
  }
  
  // Initialize other forms
  initializeRepairsForm();
  initializeDamagesForm();
}

// Handle sales form submission
async function handleSalesSubmission(form) {
  const formData = new FormData(form);
  const saleData = {
    receipt_number: formData.get('receiptNumber'),
    date: formData.get('date'),
    customer_name: formData.get('customerName'),
    contact_info: formData.get('contactInfo'),
    product_type: formData.get('productType'),
    quantity: parseInt(formData.get('quantity')),
    unit_price: parseFloat(formData.get('unitPrice')),
    total_amount: parseFloat(formData.get('totalAmount')),
    payment_method: formData.get('paymentMethod'),
    notes: formData.get('notes'),
    created_at: new Date().toISOString(),
    created_by: await window.supabaseAuth.getCurrentUserEmail(),
    created_by_name: await window.supabaseAuth.getCurrentUserDisplayName()
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Saving...';
  submitButton.disabled = true;
  
  try {
    await saveSalesEntry(saleData);
    
    alert('Sale recorded successfully!');
    
    // Reset form
    form.reset();
    setDefaultDate();
    generateAutoIds();
    
  } catch (error) {
    console.error('Error saving sale entry:', error);
    alert('Error saving sale. Please try again.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Save sales entry to Supabase database
async function saveSalesEntry(saleData) {
  try {
    // Save to Supabase database
    const { data, error } = await window.supabaseClient.from('sales_transactions').insert([saleData]);
    
    if (error) {
      console.error('Error saving sales entry to Supabase:', error);
      throw error;
    }
    
    // Also save to localStorage as fallback
    let salesEntries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    salesEntries.push(saleData);
    localStorage.setItem('salesEntries', JSON.stringify(salesEntries));
  } catch (error) {
    console.error('Error in saveSalesEntry:', error);
    // Fallback to localStorage only if Supabase fails
    let salesEntries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    salesEntries.push(saleData);
    localStorage.setItem('salesEntries', JSON.stringify(salesEntries));
    
    // Optionally show user feedback about the error
    alert('Data saved locally, but failed to sync to cloud. Please check your connection.');
  }
}

// Handle expenses form submission
async function handleExpensesSubmission(form) {
  const formData = new FormData(form);
  const expenseData = {
    expense_number: formData.get('expenseNumber'),
    date: formData.get('expenseDate'),
    category: formData.get('expenseCategory'),
    vendor: formData.get('vendor'),
    description: formData.get('expenseDescription'),
    amount: parseFloat(formData.get('amount')),
    payment_method: formData.get('paymentMethod'),
    notes: formData.get('notes'),
    created_at: new Date().toISOString(),
    created_by: await window.supabaseAuth.getCurrentUserEmail(),
    created_by_name: await window.supabaseAuth.getCurrentUserDisplayName()
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Saving...';
  submitButton.disabled = true;
  
  try {
    await saveExpenseEntry(expenseData);
    
    alert('Expense recorded successfully!');
    
    // Reset form
    form.reset();
    setDefaultDate();
    generateAutoIds();
    
  } catch (error) {
    console.error('Error saving expense entry:', error);
    alert('Error saving expense. Please try again.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Save expense entry to Supabase database
async function saveExpenseEntry(expenseData) {
  try {
    // Save to Supabase database
    const { data, error } = await window.supabaseClient.from('expense_transactions').insert([expenseData]);
    
    if (error) {
      console.error('Error saving expense entry to Supabase:', error);
      throw error;
    }
    
    // Also save to localStorage as fallback
    let expenseEntries = JSON.parse(localStorage.getItem('expenseEntries') || '[]');
    expenseEntries.push(expenseData);
    localStorage.setItem('expenseEntries', JSON.stringify(expenseEntries));
  } catch (error) {
    console.error('Error in saveExpenseEntry:', error);
    // Fallback to localStorage only if Supabase fails
    let expenseEntries = JSON.parse(localStorage.getItem('expenseEntries') || '[]');
    expenseEntries.push(expenseData);
    localStorage.setItem('expenseEntries', JSON.stringify(expenseEntries));
    
    // Optionally show user feedback about the error
    alert('Data saved locally, but failed to sync to cloud. Please check your connection.');
  }
}

// Set up all form handlers when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFormHandlers);
} else {
  setupFormHandlers();
}