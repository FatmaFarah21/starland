// Production module with Supabase integration

// Load production records from database
async function loadProductionData() {
    try {
        const productionList = document.getElementById('recentProductionList') || document.getElementById('production-tbody');
        
        if (!productionList) return;
        
        // Show loading state
        productionList.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">Loading...</td></tr>';
        
        // Fetch from database
        const records = await window.db.getProduction();
        
        if (!records || records.length === 0) {
            productionList.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">No production records yet</td></tr>';
            return;
        }

        // Build table rows
        let html = '';
        records.forEach(record => {
            html += `
                <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-4 py-3 text-sm">${new Date(record.date || record.created_at).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.category || '-'}</td>
                    <td class="px-4 py-3 text-sm font-semibold">${record.quantity || 0}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${record.notes || '-'}</td>
                    <td class="px-4 py-3 text-sm flex gap-2">
                        <button onclick="editProduction('${record.id}')" class="text-blue-600 hover:text-blue-800">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteProduction('${record.id}')" class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        productionList.innerHTML = html;

    } catch (error) {
        console.error('Error loading production data:', error);
        const productionList = document.getElementById('recentProductionList') || document.getElementById('production-tbody');
        if (productionList) {
            productionList.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-600">Error loading data: ${error.message}</td></tr>`;
        }
    }
}

// Add new production record
async function handleSubmitProduction() {
    try {
        const form = document.getElementById('production-form') || document.getElementById('productionForm');
        if (!form) return;

        const data = {
            date: document.getElementById('product-date')?.value || new Date().toISOString().split('T')[0],
            category: document.getElementById('product-category')?.value || document.getElementById('category')?.value,
            quantity: parseFloat(document.getElementById('quantity')?.value || 0),
            notes: document.getElementById('notes')?.value || null
        };

        // Validate required fields
        if (!data.date || !data.category || !data.quantity) {
            alert('Please fill in all required fields');
            return;
        }

        const result = await window.db.addProduction(data);
        
        if (result) {
            alert('✅ Production record added successfully!');
            form.reset();
            loadProductionData(); // Refresh table
        }

    } catch (error) {
        console.error('Error adding production:', error);
        alert('❌ Error: ' + (error.message || 'Failed to add record'));
    }
}

// Edit production record - open modal
let currentEditProductionId = null;
async function editProduction(id) {
    try {
        // Fetch the record to populate modal
        const records = await window.db.getProduction();
        const record = records.find(r => r.id === id);
        
        if (!record) {
            alert('Record not found');
            return;
        }
        
        // Populate modal with record data
        document.getElementById('editDate').value = record.date || '';
        document.getElementById('editCategory').value = record.category || '';
        document.getElementById('editQuantity').value = record.quantity || '';
        document.getElementById('editNotes').value = record.notes || '';
        
        // Store ID for save
        currentEditProductionId = id;
        
        // Show modal
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading record for edit:', error);
        alert('❌ Error: ' + (error.message || 'Failed to load record'));
    }
}

// Save edited production
async function saveEditProduction() {
    try {
        if (!currentEditProductionId) {
            alert('No record selected');
            return;
        }
        
        const updateData = {
            date: document.getElementById('editDate').value,
            category: document.getElementById('editCategory').value,
            quantity: parseFloat(document.getElementById('editQuantity').value) || 0,
            notes: document.getElementById('editNotes').value
        };
        
        if (!updateData.date || !updateData.category || !updateData.quantity) {
            alert('Please fill in all required fields');
            return;
        }
        
        await window.db.updateProduction(currentEditProductionId, updateData);
        alert('✅ Updated successfully!');
        closeEditModal();
        loadProductionData();
    } catch (error) {
        console.error('Error updating production:', error);
        alert('❌ Error: ' + (error.message || 'Failed to update record'));
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditProductionId = null;
}

// Delete production record
async function deleteProduction(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        try {
            await window.db.deleteProduction(id);
            alert('✅ Deleted successfully!');
            loadProductionData();
        } catch (error) {
            console.error('Error deleting production:', error);
            alert('❌ Error: ' + (error.message || 'Failed to delete record'));
        }
    }
}

// Expose functions to window for HTML event handlers
window.loadProductionData = loadProductionData;
window.handleSubmitProduction = handleSubmitProduction;
window.editProduction = editProduction;
window.deleteProduction = deleteProduction;
window.saveEditProduction = saveEditProduction;
window.closeEditModal = closeEditModal;
