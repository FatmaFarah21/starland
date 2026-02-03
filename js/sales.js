// Sales module with Supabase integration

// Calculate remaining amount
function calculateRemaining() {
    const total = parseFloat(document.getElementById('saleTotal').value) || 0;
    const paid = parseFloat(document.getElementById('salePaid').value) || 0;
    const remaining = Math.max(0, total - paid);
    document.getElementById('saleRemaining').value = remaining.toFixed(2);
}

// Calculate remaining amount in edit modal
function calculateEditRemaining() {
    const total = parseFloat(document.getElementById('editTotalAmount').value) || 0;
    const paid = parseFloat(document.getElementById('editAmountPaid').value) || 0;
    const remaining = Math.max(0, total - paid);
    document.getElementById('editAmountRemaining').value = remaining.toFixed(2);
}

// Get payment status based on remaining amount
function getPaymentStatus(remaining, total) {
    if (remaining === 0) return 'Paid';
    if (remaining === total) return 'Pending';
    return 'Partial';
}

// Get status badge styling
function getStatusBadge(status) {
    switch(status) {
        case 'Paid':
            return '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Paid</span>';
        case 'Pending':
            return '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">Pending</span>';
        case 'Partial':
            return '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">Partial</span>';
        default:
            return '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300">Unknown</span>';
    }
}

// Load sales data from database
async function loadSalesData() {
    try {
        const salesList = document.getElementById('recentSalesList') || document.getElementById('sales-tbody');
        
        if (!salesList) return;
        
        // Show loading state
        salesList.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-slate-500">Loading...</td></tr>';
        
        // Fetch from database
        const records = await window.db.getSales();
        
        if (!records || records.length === 0) {
            salesList.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-slate-500">No sales records yet</td></tr>';
            return;
        }

        // Build table rows
        let html = '';
        records.forEach(record => {
            const totalAmount = parseFloat(record.total_amount || 0);
            const amountPaid = parseFloat(record.amount_paid || 0);
            const amountRemaining = Math.max(0, totalAmount - amountPaid);
            const status = getPaymentStatus(amountRemaining, totalAmount);
            
            html += `
                <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="px-4 py-3 text-sm">${new Date(record.date || record.created_at).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.customer_name || '-'}</td>
                    <td class="px-4 py-3 text-sm">${record.product || '-'}</td>
                    <td class="px-4 py-3 text-sm text-right">${record.quantity || 0}</td>
                    <td class="px-4 py-3 text-sm text-right font-semibold">KES ${totalAmount.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-right">KES ${amountPaid.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-right font-semibold ${amountRemaining > 0 ? 'text-amber-600' : 'text-green-600'} dark:${amountRemaining > 0 ? 'text-amber-400' : 'text-green-400'}">KES ${amountRemaining.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-center">${getStatusBadge(status)}</td>
                    <td class="px-4 py-3 text-sm flex gap-2 justify-end">
                        <button onclick="editSales('${record.id}')" class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteSales('${record.id}')" class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        salesList.innerHTML = html;

    } catch (error) {
        console.error('Error loading sales data:', error);
        const salesList = document.getElementById('recentSalesList') || document.getElementById('sales-tbody');
        if (salesList) {
            salesList.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-red-600">Error loading data</td></tr>`;
        }
    }
}

// Add new sales record
async function handleAddSales() {
    try {
        // Get form values - adjust IDs based on your actual HTML form
        const totalAmount = parseFloat(document.getElementById('saleTotal')?.value || 0);
        const amountPaid = parseFloat(document.getElementById('salePaid')?.value || 0);
        
        // Try to get other fields - they might have different IDs in your form
        const date = new Date().toISOString().split('T')[0];
        const customerName = 'Customer'; // Will need actual customer input field
        const product = 'Product'; // Will need actual product input field
        const quantity = 1; // Will need actual quantity input field
        
        if (!totalAmount) {
            alert('Please enter total amount');
            return;
        }

        const data = {
            date,
            customer_name: customerName,
            product,
            quantity,
            total_amount: totalAmount,
            amount_paid: amountPaid,
            payment_method: 'Cash'
        };

        const result = await window.db.addSales(data);
        
        if (result) {
            alert('✅ Sales entry added successfully!');
            // Clear form
            document.getElementById('saleTotal').value = '';
            document.getElementById('salePaid').value = '';
            document.getElementById('saleRemaining').value = '';
            loadSalesData();
        }

    } catch (error) {
        console.error('Error adding sales:', error);
        alert('❌ Error: ' + (error.message || 'Failed to add record'));
    }
}

// Edit sales record - open modal
let currentEditSaleId = null;
async function editSales(id) {
    try {
        // Fetch the record to populate modal
        const records = await window.db.getSales();
        const record = records.find(r => r.id === id);
        
        if (!record) {
            alert('Record not found');
            return;
        }
        
        // Populate modal with record data
        document.getElementById('editCustomerName').value = record.customer_name || '';
        document.getElementById('editProduct').value = record.product || '';
        document.getElementById('editQuantity').value = record.quantity || '';
        document.getElementById('editTotalAmount').value = record.total_amount || '';
        document.getElementById('editAmountPaid').value = record.amount_paid || '';
        
        // Calculate remaining
        calculateEditRemaining();
        
        // Store ID for save
        currentEditSaleId = id;
        
        // Show modal
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading record for edit:', error);
        alert('❌ Error: ' + (error.message || 'Failed to load record'));
    }
}

// Save edited sale
async function saveEditSale() {
    try {
        if (!currentEditSaleId) {
            alert('No record selected');
            return;
        }
        
        const updateData = {
            customer_name: document.getElementById('editCustomerName').value,
            product: document.getElementById('editProduct').value,
            quantity: parseFloat(document.getElementById('editQuantity').value) || 0,
            total_amount: parseFloat(document.getElementById('editTotalAmount').value) || 0,
            amount_paid: parseFloat(document.getElementById('editAmountPaid').value) || 0
        };
        
        if (!updateData.customer_name || !updateData.product || !updateData.quantity || !updateData.total_amount) {
            alert('Please fill in all fields');
            return;
        }
        
        await window.db.updateSales(currentEditSaleId, updateData);
        alert('✅ Updated successfully!');
        closeEditModal();
        loadSalesData();
    } catch (error) {
        console.error('Error updating sales:', error);
        alert('❌ Error: ' + (error.message || 'Failed to update record'));
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditSaleId = null;
}

// Delete sales record
async function deleteSales(id) {
    if (confirm('Are you sure you want to delete this sales record?')) {
        try {
            await window.db.deleteSales(id);
            alert('✅ Deleted successfully!');
            loadSalesData();
        } catch (error) {
            console.error('Error deleting sales:', error);
            alert('❌ Error: ' + (error.message || 'Failed to delete record'));
        }
    }
}

// Expose functions to window for HTML event handlers
window.loadSalesData = loadSalesData;
window.handleAddSales = handleAddSales;
window.editSales = editSales;
window.deleteSales = deleteSales;
window.saveEditSale = saveEditSale;
window.closeEditModal = closeEditModal;
window.deleteSales = deleteSales;
