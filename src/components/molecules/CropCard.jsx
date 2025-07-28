import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/utils/cn";

const CropCard = ({ crop, onEdit, onDelete }) => {
  const statusColors = {
    planted: "secondary",
    growing: "success",
    harvested: "warning",
    failed: "error"
  };

  const getCropIcon = (type) => {
    const icons = {
      corn: "Wheat",
      tomato: "Apple",
      potato: "Package2",
      carrot: "Carrot",
      lettuce: "Leaf",
      beans: "Grape",
      default: "Sprout"
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const getDaysToHarvest = () => {
    if (!crop.expectedHarvest) return null;
    const days = differenceInDays(new Date(crop.expectedHarvest), new Date());
    return days;
  };

  const daysToHarvest = getDaysToHarvest();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-secondary/10 text-secondary">
              <ApperIcon name={getCropIcon(crop.type)} size={20} />
</div>
            <div>
              <h3 className="font-semibold text-primary text-lg">{crop.Name || `${crop.type} - ${crop.variety}`}</h3>
              <p className="text-sm text-gray-600">{crop.type} • {crop.variety}</p>
            </div>
          </div>
          <Badge variant={statusColors[crop.status]}>
            {crop.status}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="MapPin" size={14} />
            <span>{crop.fieldLocation}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" size={14} />
            <span>Planted: {format(new Date(crop.plantingDate), "MMM dd, yyyy")}</span>
          </div>

          {crop.expectedHarvest && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Clock" size={14} />
              <span>
                Harvest: {format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}
                {daysToHarvest !== null && (
                  <span className={cn(
                    "ml-2 font-medium",
                    daysToHarvest < 0 ? "text-error" : daysToHarvest <= 7 ? "text-warning" : "text-success"
                  )}>
                    ({daysToHarvest < 0 ? "Overdue" : `${daysToHarvest} days`})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar based on days since planting */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Growth Progress</span>
            <span>{crop.status === "harvested" ? "100%" : "In Progress"}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                crop.status === "harvested" ? "bg-success" : "bg-secondary"
              )}
              style={{ 
                width: crop.status === "harvested" ? "100%" : 
                       crop.status === "growing" ? "60%" : "30%" 
              }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(crop)}
            className="text-primary hover:bg-primary/10"
          >
            <ApperIcon name="Edit2" size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(crop)}
            className="text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCard;