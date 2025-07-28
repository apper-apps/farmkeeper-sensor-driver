import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Package", 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
        
        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2 opacity-20">
          <ApperIcon name="Sprout" size={16} className="text-secondary" />
          <ApperIcon name="Leaf" size={16} className="text-primary" />
          <ApperIcon name="Sun" size={16} className="text-accent" />
        </div>
      </div>
    </div>
  );
};

export default Empty;