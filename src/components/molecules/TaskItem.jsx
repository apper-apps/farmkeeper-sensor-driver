import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const priorityColors = {
    high: "error",
    medium: "warning", 
    low: "success"
  };

  const taskTypeIcons = {
    watering: "Droplets",
    fertilizing: "Sprout",
    harvesting: "Package",
    planting: "Seed",
    pruning: "Scissors",
    other: "CheckSquare"
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.completed && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <button
              onClick={() => onToggleComplete(task)}
              className="mt-1 flex-shrink-0"
            >
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                task.completed 
                  ? "bg-success border-success text-white" 
                  : "border-gray-300 hover:border-primary"
              )}>
                {task.completed && <ApperIcon name="Check" size={12} />}
              </div>
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon 
                  name={taskTypeIcons[task.type] || "CheckSquare"} 
                  size={16} 
                  className="text-primary flex-shrink-0" 
                />
                <h3 className={cn(
                  "font-medium text-primary truncate",
                  task.completed && "line-through"
                )}>
                  {task.title}
                </h3>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" size={14} />
                  <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                </div>
                <Badge variant={priorityColors[task.priority]} size="sm">
                  {task.priority}
                </Badge>
              </div>
              
              {task.notes && (
                <p className="text-sm text-gray-500 line-clamp-2">{task.notes}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task)}
              className="h-8 w-8 p-0 text-error hover:text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;