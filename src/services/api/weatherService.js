import weatherData from "@/services/mockData/weather.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const weatherService = {
  async getForecast() {
    await delay(250);
    return [...weatherData];
  },

  async getCurrentWeather() {
    await delay(200);
    return { ...weatherData[0] };
  },

  async getWeatherAlerts() {
    await delay(200);
    const current = weatherData[0];
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
  }
};

export default weatherService;