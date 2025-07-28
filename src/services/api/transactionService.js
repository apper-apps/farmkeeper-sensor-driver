const transactionService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "farmId" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions:", error.message);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "farmId" } }
        ]
      };
      
      const response = await apperClient.getRecordById('transaction', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching transaction with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async getByFarm(farmId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "farmId" } }
        ],
        where: [
          {
            FieldName: "farmId",
            Operator: "EqualTo",
            Values: [parseInt(farmId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions by farm:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions by farm:", error.message);
      }
      throw error;
    }
  },

  async create(transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: transactionData.Name || transactionData.description,
          type: transactionData.type,
          category: transactionData.category,
          amount: parseFloat(transactionData.amount),
          date: transactionData.date,
          description: transactionData.description,
          farmId: parseInt(transactionData.farmId?.Id || transactionData.farmId)
        }]
      };
      
      const response = await apperClient.createRecord('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create transaction');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
      } else {
        console.error("Error creating transaction:", error.message);
      }
      throw error;
    }
  },

  async update(id, transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: transactionData.Name || transactionData.description,
          type: transactionData.type,
          category: transactionData.category,
          amount: parseFloat(transactionData.amount),
          date: transactionData.date,
          description: transactionData.description,
          farmId: parseInt(transactionData.farmId?.Id || transactionData.farmId)
        }]
      };
      
      const response = await apperClient.updateRecord('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to update transaction');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
      } else {
        console.error("Error updating transaction:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
      } else {
        console.error("Error deleting transaction:", error.message);
      }
      throw error;
    }
  }
};

export default transactionService;