// Materials module with Supabase integration

// Load daily materials usage from database
async function loadMaterialsUsageData() {
    try {
        const usageList = document.getElementById('recentUsageList') || document.getElementById('materials-usage-tbody');
        
        if (!usageList) return;
        
        usageList.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">Loading...</td></tr>';
        
        const records = await window.db.getMaterialsDaily();
        
        if (!records || records.length === 0) {
            usageList.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">No usage records yet</td></tr>';
            return;
        }

        let html = '';
        records.forEach(record => {
            html += `
                <tr class="border-b border-slate-200 dark:border-slate-700">
                    <td class="px-4 py-3 text-sm">${new Date(record.date).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.b_preform || 0}</td>
                    <td class="px-4 py-3 text-sm">${record.s_preform || 0}</td>
                    <td class="px-4 py-3 text-sm">${record.big_caps || 0}</td>
                    <td class="px-4 py-3 text-sm">${record.small_caps || 0}</td>
                    <td class="px-4 py-3 text-sm">${record.plastic || 0}</td>
                </tr>
            `;
        });
        
        usageList.innerHTML = html;

    } catch (error) {
        console.error('Error loading materials usage:', error);
    }
}

// Add daily material usage
async function handleSubmitDailyMaterial() {
    try {
        const data = {
            date: document.getElementById('material-date')?.value || new Date().toISOString().split('T')[0],
            b_preform: parseFloat(document.getElementById('b-preform')?.value || 0),
            s_preform: parseFloat(document.getElementById('s-preform')?.value || 0),
            big_caps: parseFloat(document.getElementById('big-caps')?.value || 0),
            small_caps: parseFloat(document.getElementById('small-caps')?.value || 0),
            plastic: parseFloat(document.getElementById('plastic-used')?.value || 0)
        };

        const result = await window.db.addMaterialDaily(data);
        
        if (result) {
            alert('✅ Daily materials recorded!');
            document.getElementById('daily-form')?.reset();
            loadMaterialsUsageData();
        }

    } catch (error) {
        console.error('Error adding daily material:', error);
        alert('❌ Error: ' + (error.message || 'Failed to add record'));
    }
}

// Load inventory purchases
async function loadInventoryPurchasesData() {
    try {
        const purchaseList = document.getElementById('recentPurchasesList') || document.getElementById('materials-purchases-tbody');
        
        if (!purchaseList) return;
        
        purchaseList.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">Loading...</td></tr>';
        
        const records = await window.db.getInventoryPurchases();
        
        if (!records || records.length === 0) {
            purchaseList.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">No purchases yet</td></tr>';
            return;
        }

        let html = '';
        records.forEach(record => {
            html += `
                <tr class="border-b border-slate-200 dark:border-slate-700">
                    <td class="px-4 py-3 text-sm">${new Date(record.purchase_date).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm">${record.category || '-'}</td>
                    <td class="px-4 py-3 text-sm">${record.quantity || 0}</td>
                    <td class="px-4 py-3 text-sm">KES ${parseFloat(record.unit_cost || 0).toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm">KES ${parseFloat(record.total_cost || 0).toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm">${record.supplier || '-'}</td>
                </tr>
            `;
        });
        
        purchaseList.innerHTML = html;

    } catch (error) {
        console.error('Error loading inventory purchases:', error);
    }
}

// Add inventory purchase
async function handleSubmitInventoryPurchase() {
    try {
        const quantity = parseFloat(document.getElementById('purchase-quantity')?.value || 0);
        const unitCost = parseFloat(document.getElementById('unit-cost')?.value || 0);
        const totalCost = quantity * unitCost;

        const data = {
            purchase_date: document.getElementById('purchase-date')?.value || new Date().toISOString().split('T')[0],
            category: document.getElementById('purchase-category')?.value,
            quantity,
            unit_cost: unitCost,
            total_cost: totalCost,
            supplier: document.getElementById('supplier')?.value || null
        };

        if (!data.purchase_date || !data.category || !data.quantity || !data.unit_cost) {
            alert('Please fill in all required fields');
            return;
        }

        const result = await window.db.addInventoryPurchase(data);
        
        if (result) {
            alert('✅ Purchase recorded!');
            document.getElementById('purchase-form')?.reset();
            loadInventoryPurchasesData();
        }

    } catch (error) {
        console.error('Error adding inventory purchase:', error);
        alert('❌ Error: ' + (error.message || 'Failed to add record'));
    }
}

// Edit material - open modal
let currentEditMaterialId = null;
function editMaterial(materialType, opening, added, used) {
    try {
        // Populate modal with material data
        document.getElementById('editMaterial').value = materialType || '';
        document.getElementById('editOpening').value = opening || '';
        document.getElementById('editAdded').value = added || '';
        document.getElementById('editUsed').value = used || '';
        
        // Store for save (using material type as ID for this simple case)
        currentEditMaterialId = materialType;
        
        // Show modal
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('❌ Error: ' + (error.message || 'Failed to open modal'));
    }
}

// Save edited material
async function saveEditMaterial() {
    try {
        if (!currentEditMaterialId) {
            alert('No material selected');
            return;
        }
        
        const updateData = {
            material_type: document.getElementById('editMaterial').value,
            opening_stock: parseFloat(document.getElementById('editOpening').value) || 0,
            added: parseFloat(document.getElementById('editAdded').value) || 0,
            used: parseFloat(document.getElementById('editUsed').value) || 0
        };
        
        if (!updateData.material_type || !updateData.opening_stock || !updateData.added || !updateData.used) {
            alert('Please fill in all fields');
            return;
        }
        
        // Update inventory summary
        await window.db.updateInventorySummary(currentEditMaterialId, {
            stock_level: (updateData.opening_stock + updateData.added) - updateData.used
        });
        alert('✅ Updated successfully!');
        closeEditModal();
        loadMaterialsUsageData();
    } catch (error) {
        console.error('Error updating material:', error);
        alert('❌ Error: ' + (error.message || 'Failed to update record'));
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditMaterialId = null;
}
window.loadMaterialsUsageData = loadMaterialsUsageData;
window.handleSubmitDailyMaterial = handleSubmitDailyMaterial;
window.loadInventoryPurchasesData = loadInventoryPurchasesData;
window.handleSubmitInventoryPurchase = handleSubmitInventoryPurchase;
window.editMaterial = editMaterial;
window.saveEditMaterial = saveEditMaterial;
window.closeEditModal = closeEditModal;
