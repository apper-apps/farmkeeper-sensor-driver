import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const WeatherCard = ({ weatherData }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      default: "Sun"
    };
    return icons[condition?.toLowerCase()] || icons.default;
  };

  const getCurrentWeather = () => weatherData[0] || {};
  const getForecast = () => weatherData.slice(1, 6) || [];

  const current = getCurrentWeather();
  const forecast = getForecast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="CloudSun" size={20} />
          <span>Weather Forecast</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <ApperIcon name={getWeatherIcon(current.condition)} size={32} className="text-primary" />
            <span className="text-3xl font-bold text-primary">{current.temperature}°F</span>
          </div>
          <p className="text-gray-600 capitalize">{current.condition}</p>
          <p className="text-sm text-gray-500">{format(new Date(), "EEEE, MMMM dd")}</p>
          <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Droplets" size={14} />
              <span>{current.humidity}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Wind" size={14} />
              <span>{current.windSpeed} mph</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="CloudRain" size={14} />
              <span>{current.precipitation}%</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="font-medium text-primary mb-3">5-Day Forecast</h4>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <ApperIcon name={getWeatherIcon(day.condition)} size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">{format(new Date(day.date), "EEE")}</p>
                    <p className="text-xs text-gray-500 capitalize">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{day.high}°/{day.low}°</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="CloudRain" size={10} />
                      <span>{day.precipitation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural Alert */}
        {current.precipitation > 70 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertTriangle" size={16} className="text-warning" />
              <p className="text-sm font-medium text-warning">Weather Alert</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              High chance of rain today. Consider postponing outdoor activities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;