"use client";
import React, { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Switch } from "../ui/Switch";
import CategoryFeedPieChart from "../componentSplit/CategoryFeedPieChart";
import HeaderSwitch from "../componentSplit/HeaderSwitch";

interface Transaction {
  _id: string;
  expenses: number;
  date: string;
  category: string;
  remarks: string;
}

interface Props {
  transactions?: Transaction[];
}

export default function BudgetTransportChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);
  //Category B - Calculate for Transports Used/Transports Total Budget Transports
  //======================================================================

  //Find Total Transports Used
  //Calculate Total Transports Used as collection of object
  const categoryTransportsUsed = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Transport") &&
      !transaction.category.includes("Budget")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const transportList = ["Fuel", "Toll", "Maintenance", "Urgent Repair"];
  const transportLeftover = transportList.filter(
    (transport) =>
      !Object.keys(categoryTransportsUsed).some((category) =>
        category.includes(transport)
      )
  );

  //calculate Total Value of Transports Used
  const totalValueTransportsUsed = Object.values(categoryTransportsUsed).reduce(
    (total, value) => total + value,
    0
  );

  //Find Total Transports Budget Set Up
  const categoryTransportsBudget = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Budget") &&
      transaction.category.includes("Transport")
    ) {
      const category = "Transports Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalValueTransportsBudget =
    categoryTransportsBudget["Transports Budget"];
  const totalValueTransportsBudgetLeftover =
    totalValueTransportsBudget - totalValueTransportsUsed;

  //Feed Data used and Leftover
  const dataCategoryCFeedMain = [
    { name: "Used", value: totalValueTransportsUsed },
    { name: "Leftover", value: totalValueTransportsBudgetLeftover },
  ];

  const categoryBFeedAllAdd = [
    { name: "Leftover", value: totalValueTransportsBudgetLeftover },
  ];

  // Recharts use array format
  const dataCategoryCFeedAllArray = Object.entries(categoryTransportsUsed).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const dataCategoryCFeedAll = [
    ...dataCategoryCFeedAllArray,
    ...categoryBFeedAllAdd,
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="w-full justify-center  min-w-[300px] ">
      <HeaderSwitch
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={"Transports Used / Total Budget Transports"}
      ></HeaderSwitch>
      {isVisible && (
        <>
          <div className="flex max-sm:flex-col items-center gap-4 py-4 justify-center w-full bg-white border border-gray-200">
            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedMain}
              totalValue={totalValueTransportsBudget}
            ></CategoryFeedPieChart>

            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedAll}
              totalValue={totalValueTransportsBudget}
            ></CategoryFeedPieChart>
          </div>

          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Transports Used is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueTransportsUsed ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Transports is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueTransportsBudget ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Transports Leftover is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueTransportsBudgetLeftover ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Transport Leftover is&nbsp;
            <div className="text-blue-500">
              | {(transportLeftover ?? []).join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
