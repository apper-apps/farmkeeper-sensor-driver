import React from "react";
import FinanceManagement from "@/components/organisms/FinanceManagement";

const Finances = ({ selectedFarm }) => {
  return <FinanceManagement selectedFarm={selectedFarm} />;
};

export default Finances;