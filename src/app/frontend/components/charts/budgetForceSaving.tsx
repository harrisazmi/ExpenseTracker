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

export default function BudgetForceSavingChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);
  //Category B - Calculate for ForceSavings Used/ForceSavings Total Budget ForceSavings
  //======================================================================

  //Find Total ForceSavings Used
  //Calculate Total ForceSavings Used as collection of object
  const categoryForceSavingsUsed = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Savings") &&
      !transaction.category.includes("Budget")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  //calculate Total Value of ForceSavings Used
  const totalValueForceSavingsUsed = Object.values(
    categoryForceSavingsUsed
  ).reduce((total, value) => total + value, 0);

  //Find Total ForceSavings Budget Set Up
  const categoryForceSavingsBudget = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Budget") &&
      transaction.category.includes("Saving")
    ) {
      const category = "ForceSavings Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalValueForceSavingsBudget =
    categoryForceSavingsBudget["ForceSavings Budget"];
  const totalValueForceSavingsBudgetLeftover =
    totalValueForceSavingsBudget - totalValueForceSavingsUsed;

  //Feed Data used and Leftover
  const dataCategoryCFeedMain = [
    { name: "Used", value: totalValueForceSavingsUsed },
    { name: "Leftover", value: totalValueForceSavingsBudgetLeftover },
  ];

  const categoryBFeedAllAdd = [
    { name: "Leftover", value: totalValueForceSavingsBudgetLeftover },
  ];

  // Recharts use array format
  const dataCategoryCFeedAllArray = Object.entries(
    categoryForceSavingsUsed
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const dataCategoryCFeedAll = [
    ...dataCategoryCFeedAllArray,
    ...categoryBFeedAllAdd,
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="w-full  min-w-[300px]  justify-center">
      <HeaderSwitch
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={"Force Savings Used / Total Budget Force Savings"}
      ></HeaderSwitch>
      {isVisible && (
        <>
          <div className="flex max-sm:flex-col items-center gap-4 py-4 justify-center w-full bg-white border border-gray-200">
            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedMain}
              totalValue={totalValueForceSavingsBudget}
            ></CategoryFeedPieChart>

            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedAll}
              totalValue={totalValueForceSavingsBudget}
            ></CategoryFeedPieChart>
          </div>

          <div className="flex items-center justify-center p-2 font-semibold border">
            Total ForceSavings Used is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueForceSavingsUsed ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget ForceSavings is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueForceSavingsBudget ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget ForceSavings Leftover is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueForceSavingsBudgetLeftover ?? 0).toFixed(2)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
