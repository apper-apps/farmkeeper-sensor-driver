const weatherService = {
  async getForecast() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "temperature" } },
          { field: { Name: "condition" } },
          { field: { Name: "humidity" } },
          { field: { Name: "windSpeed" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "high" } },
          { field: { Name: "low" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching weather forecast:", error?.response?.data?.message);
      } else {
        console.error("Error fetching weather forecast:", error.message);
      }
      throw error;
    }
  },

  async getCurrentWeather() {
    try {
      const weatherData = await this.getForecast();
      return weatherData[0] || {};
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current weather:", error?.response?.data?.message);
      } else {
        console.error("Error fetching current weather:", error.message);
      }
      throw error;
    }
  },

  async getWeatherAlerts() {
    try {
      const current = await this.getCurrentWeather();
      const alerts = [];

      if (current.precipitation > 70) {
        alerts.push({
          type: "warning",
          title: "Heavy Rain Expected",
          message: "Consider postponing outdoor activities and protect sensitive crops."
        });
      }

      if (current.temperature > 90) {
        alerts.push({
          type: "error",
          title: "Extreme Heat Warning",
          message: "Ensure adequate irrigation and consider shade protection for crops."
        });
      }

      if (current.temperature < 35) {
        alerts.push({
          type: "warning",
          title: "Frost Warning",
          message: "Protect sensitive crops from potential frost damage."
        });
      }

      return alerts;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error generating weather alerts:", error?.response?.data?.message);
      } else {
        console.error("Error generating weather alerts:", error.message);
      }
      return [];
    }
  }
};

export default weatherService;