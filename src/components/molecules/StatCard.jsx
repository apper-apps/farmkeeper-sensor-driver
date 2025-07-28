import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    accent: "text-accent bg-accent/10"
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-primary">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16}
                  className={trend === "up" ? "text-success" : "text-error"}
                />
                <span className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-success" : "text-error"
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-full", colorClasses[color])}>
            <ApperIcon name={icon} size={24} className="current-color" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;