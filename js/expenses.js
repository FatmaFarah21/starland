// Expenses module with Supabase integration

// Load expenses from database
async function loadExpensesData() {
    try {
        const expensesList = document.getElementById('recentExpensesList') || document.getElementById('expenses-tbody');
        
        if (!expensesList) return;
        
        // Show loading state
        expensesList.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">Loading...</td></tr>';
        
        // Fetch from database
        const records = await window.db.getExpenses();
        
        if (!records || records.length === 0) {
            expensesList.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">No expenses yet</td></tr>';
            return;
        }

        // Build table rows
        let html = '';
        records.forEach(record => {
            html += `
                <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="px-4 py-3 text-sm">${new Date(record.date || record.created_at).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.category || '-'}</td>
                    <td class="px-4 py-3 text-sm">${record.description || '-'}</td>
                    <td class="px-4 py-3 text-sm text-right font-semibold">KES ${parseFloat(record.amount || 0).toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm flex gap-2">
                        <button onclick="editExpense('${record.id}')" class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteExpense('${record.id}')" class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        expensesList.innerHTML = html;

    } catch (error) {
        console.error('Error loading expenses data:', error);
        const expensesList = document.getElementById('recentExpensesList') || document.getElementById('expenses-tbody');
        if (expensesList) {
            expensesList.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-600">Error loading data</td></tr>`;
        }
    }
}

// Add new expense
async function handleAddExpense() {
    try {
        const date = document.getElementById('expense-date')?.value || new Date().toISOString().split('T')[0];
        const category = document.getElementById('expense-category')?.value;
        const description = document.getElementById('description')?.value;
        const amount = parseFloat(document.getElementById('amount')?.value || 0);

        if (!date || !category || !description || !amount) {
            alert('Please fill in all required fields');
            return;
        }

        const data = {
            date,
            category,
            description,
            amount,
            notes: document.getElementById('notes')?.value || null
        };

        const result = await window.db.addExpense(data);
        
        if (result) {
            alert('✅ Expense recorded successfully!');
            document.getElementById('expense-form')?.reset();
            loadExpensesData();
        }

    } catch (error) {
        console.error('Error adding expense:', error);
        alert('❌ Error: ' + (error.message || 'Failed to add record'));
    }
}

// Edit expense - open modal
let currentEditExpenseId = null;
async function editExpense(id) {
    try {
        // Fetch the record to populate modal
        const records = await window.db.getExpenses();
        const record = records.find(r => r.id === id);
        
        if (!record) {
            alert('Record not found');
            return;
        }
        
        // Populate modal with record data
        document.getElementById('editDate').value = record.date || '';
        document.getElementById('editDescription').value = record.description || '';
        document.getElementById('editAmount').value = record.amount || '';
        document.getElementById('editCategory').value = record.category || '';
        
        // Store ID for save
        currentEditExpenseId = id;
        
        // Show modal
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading record for edit:', error);
        alert('❌ Error: ' + (error.message || 'Failed to load record'));
    }
}

// Save edited expense
async function saveEditExpense() {
    try {
        if (!currentEditExpenseId) {
            alert('No record selected');
            return;
        }
        
        const updateData = {
            date: document.getElementById('editDate').value,
            description: document.getElementById('editDescription').value,
            amount: parseFloat(document.getElementById('editAmount').value) || 0,
            category: document.getElementById('editCategory').value
        };
        
        if (!updateData.date || !updateData.description || !updateData.amount || !updateData.category) {
            alert('Please fill in all fields');
            return;
        }
        
        await window.db.updateExpense(currentEditExpenseId, updateData);
        alert('✅ Updated successfully!');
        closeEditModal();
        loadExpensesData();
    } catch (error) {
        console.error('Error updating expense:', error);
        alert('❌ Error: ' + (error.message || 'Failed to update record'));
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditExpenseId = null;
}

// Delete expense
async function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        try {
            await window.db.deleteExpense(id);
            alert('✅ Deleted successfully!');
            loadExpensesData();
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('❌ Error: ' + (error.message || 'Failed to delete record'));
        }
    }
}

// Expose functions to window for HTML event handlers
window.loadExpensesData = loadExpensesData;
window.handleAddExpense = handleAddExpense;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.saveEditExpense = saveEditExpense;
window.closeEditModal = closeEditModal;
