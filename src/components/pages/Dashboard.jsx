import React from "react";
import DashboardOverview from "@/components/organisms/DashboardOverview";

const Dashboard = ({ selectedFarm }) => {
  return <DashboardOverview selectedFarm={selectedFarm} />;
};

export default Dashboard;