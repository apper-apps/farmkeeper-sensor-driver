import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      seeds: "Seed",
      fertilizer: "Droplets",
      equipment: "Wrench",
      labor: "Users",
      fuel: "Fuel",
      harvest: "Package",
      sales: "DollarSign",
      other: "Receipt"
    };
    return icons[category] || "Receipt";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={cn(
              "p-2 rounded-full",
              transaction.type === "income" ? "bg-success/10 text-success" : "bg-error/10 text-error"
            )}>
              <ApperIcon name={getCategoryIcon(transaction.category)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-primary truncate">
                  {transaction.description}
                </h3>
                <Badge variant={transaction.type === "income" ? "success" : "error"}>
                  {transaction.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="capitalize">{transaction.category}</span>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" size={12} />
                  <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={cn(
              "font-semibold text-lg",
              transaction.type === "income" ? "text-success" : "text-error"
            )}>
              {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
            </span>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="h-8 w-8 p-0"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction)}
                className="h-8 w-8 p-0 text-error hover:text-error hover:bg-error/10"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionItem;