import React from "react";
import TaskManagement from "@/components/organisms/TaskManagement";

const Tasks = ({ selectedFarm }) => {
  return <TaskManagement selectedFarm={selectedFarm} />;
};

export default Tasks;