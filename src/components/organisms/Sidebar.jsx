import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Crops", href: "/crops", icon: "Sprout" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Finances", href: "/finances", icon: "DollarSign" },
    { name: "Weather", href: "/weather", icon: "CloudSun" }
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  // Desktop Sidebar (static)
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-primary overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary rounded-lg">
              <ApperIcon name="Wheat" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">FarmKeeper</h1>
              <p className="text-xs text-secondary/80">Smart Farm Management</p>
            </div>
          </div>
        </div>
        <nav className="mt-5 flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-secondary text-white shadow-lg"
                    : "text-primary-foreground/80 hover:bg-primary/80 hover:text-white"
                )
              }
            >
              <ApperIcon
                name={item.icon}
                size={20}
                className="mr-3 flex-shrink-0"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex-shrink-0 p-4">
          <div className="bg-primary/80 rounded-lg p-3 text-center">
            <ApperIcon name="Leaf" size={20} className="text-secondary mx-auto mb-2" />
            <p className="text-xs text-white/80">Growing sustainably</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar (overlay with transform)
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <motion.div
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary overflow-y-auto"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary rounded-lg">
                <ApperIcon name="Wheat" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-display">FarmKeeper</h1>
                <p className="text-xs text-secondary/80">Smart Farm Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-secondary transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive
                      ? "bg-secondary text-white shadow-lg"
                      : "text-primary-foreground/80 hover:bg-primary/80 hover:text-white"
                  )
                }
              >
                <ApperIcon
                  name={item.icon}
                  size={20}
                  className="mr-3 flex-shrink-0"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex-shrink-0 p-4">
            <div className="bg-primary/80 rounded-lg p-3 text-center">
              <ApperIcon name="Leaf" size={20} className="text-secondary mx-auto mb-2" />
              <p className="text-xs text-white/80">Growing sustainably</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;