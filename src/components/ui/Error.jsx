import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCcw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Refresh Page
          </Button>
        </div>
        <div className="mt-6 p-4 bg-surface rounded-lg">
          <div className="flex items-start space-x-2">
            <ApperIcon name="Info" size={16} className="text-info flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Troubleshooting Tips:</p>
              <ul className="text-left space-y-1">
                <li>• Check your internet connection</li>
                <li>• Make sure you have selected a farm</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;