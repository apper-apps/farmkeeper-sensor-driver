import React, { useState, useEffect } from "react";
import WeatherCard from "@/components/molecules/WeatherCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import weatherService from "@/services/api/weatherService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getForecast();
      setWeatherData(data);
    } catch (err) {
      console.error("Error loading weather data:", err);
      setError("Failed to load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWeatherData} />;

  const current = weatherData[0] || {};
  const alerts = [];

  // Generate alerts based on weather conditions
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

  if (current.windSpeed > 25) {
    alerts.push({
      type: "warning",
      title: "High Wind Advisory",
      message: "Secure loose equipment and check crop supports."
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Weather Forecast</h1>
        <p className="text-gray-600">Plan your farm activities based on weather conditions</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Weather Card */}
        <div className="xl:col-span-2">
          <WeatherCard weatherData={weatherData} />
        </div>

        {/* Weather Alerts & Tips */}
        <div className="space-y-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="AlertTriangle" size={20} />
                  <span>Weather Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      alert.type === "error"
                        ? "bg-error/10 border-error/20 text-error"
                        : "bg-warning/10 border-warning/20 text-warning"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <ApperIcon 
                        name={alert.type === "error" ? "AlertCircle" : "AlertTriangle"} 
                        size={16} 
                        className="flex-shrink-0 mt-0.5" 
                      />
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Farming Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Lightbulb" size={20} />
                <span>Farming Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-success/5">
                  <ApperIcon name="Droplets" size={16} className="text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-success">Irrigation</p>
                    <p className="text-sm text-gray-600">
                      {current.precipitation > 50 
                        ? "Reduce watering due to expected rainfall"
                        : "Monitor soil moisture levels regularly"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/5">
                  <ApperIcon name="Sprout" size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-secondary">Planting</p>
                    <p className="text-sm text-gray-600">
                      {current.temperature >= 50 && current.temperature <= 80
                        ? "Good conditions for planting most crops"
                        : "Consider temperature requirements for your crops"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-accent/5">
                  <ApperIcon name="Package" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-accent">Harvesting</p>
                    <p className="text-sm text-gray-600">
                      {current.precipitation < 30
                        ? "Good conditions for harvesting activities"
                        : "Delay harvesting until drier conditions"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BarChart3" size={20} />
                <span>Weather Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Thermometer" size={16} className="text-accent" />
                    <span className="text-sm text-gray-600">Avg Temperature</span>
                  </div>
                  <span className="font-medium">
                    {Math.round(weatherData.reduce((sum, day) => sum + day.temperature, 0) / weatherData.length)}°F
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CloudRain" size={16} className="text-info" />
                    <span className="text-sm text-gray-600">Avg Precipitation</span>
                  </div>
                  <span className="font-medium">
                    {Math.round(weatherData.reduce((sum, day) => sum + day.precipitation, 0) / weatherData.length)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Wind" size={16} className="text-secondary" />
                    <span className="text-sm text-gray-600">Avg Wind Speed</span>
                  </div>
                  <span className="font-medium">
                    {Math.round(weatherData.reduce((sum, day) => sum + day.windSpeed, 0) / weatherData.length)} mph
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Droplets" size={16} className="text-primary" />
                    <span className="text-sm text-gray-600">Avg Humidity</span>
                  </div>
                  <span className="font-medium">
                    {Math.round(weatherData.reduce((sum, day) => sum + day.humidity, 0) / weatherData.length)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Weather;