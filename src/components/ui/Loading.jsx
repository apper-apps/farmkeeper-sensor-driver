import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin">
            <ApperIcon name="Loader2" size={64} className="text-primary" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto animate-pulse">
            <ApperIcon name="Wheat" size={32} className="text-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">Loading Farm Data</h3>
        <p className="text-gray-600">Please wait while we fetch your information...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;