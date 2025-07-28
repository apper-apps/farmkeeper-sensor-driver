import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const UserSection = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:flex items-center space-x-2 text-sm">
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
          {user?.firstName?.[0] || user?.name?.[0] || 'U'}
        </div>
        <span className="text-gray-700 font-medium">
          {user?.firstName || user?.name || 'User'}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={logout}
        className="text-primary hover:text-primary/80"
      >
        <ApperIcon name="LogOut" size={16} />
        <span className="hidden sm:inline ml-1">Logout</span>
      </Button>
    </div>
  );
};
const Header = ({ selectedFarm, farms, onFarmChange, onToggleSidebar }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
    <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="lg:hidden text-primary">
                <ApperIcon name="Menu" size={24} />
            </Button>
            <div className="flex items-center space-x-3">
                <ApperIcon name="MapPin" size={20} className="text-primary" />
                <div>
                    <label
                        htmlFor="farm-select"
                        className="text-sm font-medium text-gray-700 block mb-1">Current Farm
                                      </label>
                    <Select
                        id="farm-select"
                        value={selectedFarm}
                        onChange={e => onFarmChange(e.target.value)}
                        className="min-w-[200px]">
                        <option value="">Select Farm</option>
                        {farms.map(farm => <option key={farm.Id} value={farm.Id}>
                            {farm.name}- {farm.location}
                        </option>)}
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
            <UserSection />
        </div>
    </div>
</div>
  );
};

export default Header;