import React from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ selectedFarm, farms, onFarmChange, onToggleSidebar }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-primary"
          >
            <ApperIcon name="Menu" size={24} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <ApperIcon name="MapPin" size={20} className="text-primary" />
            <div>
              <label htmlFor="farm-select" className="text-sm font-medium text-gray-700 block mb-1">
                Current Farm
              </label>
              <Select
                id="farm-select"
                value={selectedFarm}
                onChange={(e) => onFarmChange(e.target.value)}
                className="min-w-[200px]"
              >
                <option value="">Select Farm</option>
                {farms.map((farm) => (
                  <option key={farm.Id} value={farm.Id}>
                    {farm.name} - {farm.location}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} />
            <span>{new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary">
            <ApperIcon name="Bell" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;