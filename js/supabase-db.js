// Supabase Database Helper Functions
// This module provides functions to interact with Starland Financial System database

class SupabaseDB {
    constructor() {
        this.client = window.supabaseClient;
    }

    // ==================== PRODUCTION ====================
    async addProduction(data) {
        try {
            const { data: result, error } = await this.client
                .from('production_records')
                .insert([data]);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error adding production:', error);
            throw error;
        }
    }

    async getProduction() {
        try {
            const { data, error } = await this.client
                .from('production_records')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching production:', error);
            throw error;
        }
    }

    async updateProduction(id, data) {
        try {
            const { data: result, error } = await this.client
                .from('production_records')
                .update(data)
                .eq('id', id);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error updating production:', error);
            throw error;
        }
    }

    async deleteProduction(id) {
        try {
            const { error } = await this.client
                .from('production_records')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting production:', error);
            throw error;
        }
    }

    // ==================== SALES ====================
    async addSales(data) {
        try {
            const { data: result, error } = await this.client
                .from('sales')
                .insert([data]);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error adding sales:', error);
            throw error;
        }
    }

    async getSales() {
        try {
            const { data, error } = await this.client
                .from('sales')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching sales:', error);
            throw error;
        }
    }

    async updateSales(id, data) {
        try {
            const { data: result, error } = await this.client
                .from('sales')
                .update(data)
                .eq('id', id);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error updating sales:', error);
            throw error;
        }
    }

    async deleteSales(id) {
        try {
            const { error } = await this.client
                .from('sales')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting sales:', error);
            throw error;
        }
    }

    // ==================== EXPENSES ====================
    async addExpense(data) {
        try {
            const { data: result, error } = await this.client
                .from('expenses')
                .insert([data]);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
        }
    }

    async getExpenses() {
        try {
            const { data, error } = await this.client
                .from('expenses')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching expenses:', error);
            throw error;
        }
    }

    async updateExpense(id, data) {
        try {
            const { data: result, error } = await this.client
                .from('expenses')
                .update(data)
                .eq('id', id);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    }

    async deleteExpense(id) {
        try {
            const { error } = await this.client
                .from('expenses')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
        }
    }

    // ==================== MATERIALS ====================
    async addMaterialDaily(data) {
        try {
            const { data: result, error } = await this.client
                .from('materials_usage')
                .insert([data]);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error adding daily material:', error);
            throw error;
        }
    }

    async getMaterialsDaily() {
        try {
            const { data, error } = await this.client
                .from('materials_usage')
                .select('*')
                .order('date', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching daily materials:', error);
            throw error;
        }
    }

    async addInventoryPurchase(data) {
        try {
            const { data: result, error } = await this.client
                .from('materials_inventory_bought')
                .insert([data]);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error adding inventory purchase:', error);
            throw error;
        }
    }

    async getInventoryPurchases() {
        try {
            const { data, error } = await this.client
                .from('materials_inventory_bought')
                .select('*')
                .order('purchase_date', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching inventory purchases:', error);
            throw error;
        }
    }

    async getInventorySummary() {
        try {
            const { data, error } = await this.client
                .from('inventory_summary')
                .select('*');
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching inventory summary:', error);
            throw error;
        }
    }

    async updateInventorySummary(category, data) {
        try {
            const { data: result, error } = await this.client
                .from('inventory_summary')
                .update(data)
                .eq('category', category);
            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error updating inventory summary:', error);
            throw error;
        }
    }

    // ==================== DASHBOARD ====================
    async getDashboardStats() {
        try {
            const [production, sales, expenses, materials] = await Promise.all([
                this.client.from('production_records').select('*'),
                this.client.from('sales').select('*'),
                this.client.from('expenses').select('*'),
                this.client.from('materials_usage').select('*')
            ]);

            return {
                production: production.data || [],
                sales: sales.data || [],
                expenses: expenses.data || [],
                materials: materials.data || []
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    // ==================== REPORTS ====================
    async getProductionReport(startDate, endDate) {
        try {
            const { data, error } = await this.client
                .from('production_records')
                .select('*')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching production report:', error);
            throw error;
        }
    }

    async getSalesReport(startDate, endDate) {
        try {
            const { data, error } = await this.client
                .from('sales')
                .select('*')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching sales report:', error);
            throw error;
        }
    }

    async getExpensesReport(startDate, endDate) {
        try {
            const { data, error } = await this.client
                .from('expenses')
                .select('*')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching expenses report:', error);
            throw error;
        }
    }
}

// Create global instance
window.db = new SupabaseDB();
