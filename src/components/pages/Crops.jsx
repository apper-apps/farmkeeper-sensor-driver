import React from "react";
import CropManagement from "@/components/organisms/CropManagement";

const Crops = ({ selectedFarm }) => {
  return <CropManagement selectedFarm={selectedFarm} />;
};

export default Crops;