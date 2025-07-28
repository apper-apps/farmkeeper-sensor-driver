const cropService = {
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
          { field: { Name: "variety" } },
          { field: { Name: "plantingDate" } },
          { field: { Name: "fieldLocation" } },
          { field: { Name: "status" } },
          { field: { Name: "expectedHarvest" } },
          { field: { Name: "farmId" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
      } else {
        console.error("Error fetching crops:", error.message);
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
          { field: { Name: "variety" } },
          { field: { Name: "plantingDate" } },
          { field: { Name: "fieldLocation" } },
          { field: { Name: "status" } },
          { field: { Name: "expectedHarvest" } },
          { field: { Name: "farmId" } }
        ]
      };
      
      const response = await apperClient.getRecordById('crop', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching crop with ID ${id}:`, error.message);
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
          { field: { Name: "variety" } },
          { field: { Name: "plantingDate" } },
          { field: { Name: "fieldLocation" } },
          { field: { Name: "status" } },
          { field: { Name: "expectedHarvest" } },
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
      
      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops by farm:", error?.response?.data?.message);
      } else {
        console.error("Error fetching crops by farm:", error.message);
      }
      throw error;
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: cropData.Name || cropData.name,
          type: cropData.type,
          variety: cropData.variety,
          plantingDate: cropData.plantingDate,
          fieldLocation: cropData.fieldLocation,
          status: cropData.status,
          expectedHarvest: cropData.expectedHarvest,
          farmId: parseInt(cropData.farmId?.Id || cropData.farmId)
        }]
      };
      
      const response = await apperClient.createRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create crop');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
      } else {
        console.error("Error creating crop:", error.message);
      }
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.Name || cropData.name,
          type: cropData.type,
          variety: cropData.variety,
          plantingDate: cropData.plantingDate,
          fieldLocation: cropData.fieldLocation,
          status: cropData.status,
          expectedHarvest: cropData.expectedHarvest,
          farmId: parseInt(cropData.farmId?.Id || cropData.farmId)
        }]
      };
      
      const response = await apperClient.updateRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to update crop');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
      } else {
        console.error("Error updating crop:", error.message);
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
      
      const response = await apperClient.deleteRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
      } else {
        console.error("Error deleting crop:", error.message);
      }
      throw error;
    }
  }
};

export default cropService;