"use client";
import React, { useState } from "react";
import { Switch } from "../ui/Switch";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
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

export default function BudgetTotalChart({ transactions = [] }: Props) {
  // State to control visibility, initially set to false (closed)
  const [isVisible, setIsVisible] = useState(false);

  //Find Total Budget Used
  //====================================================
  //Calculate Total Budget Used as collection of object
  const categoryBudgetUsedTotals = transactions.reduce((acc, transaction) => {
    if (
      !transaction.category.includes("Budget") &&
      !transaction.category.includes("InputMoney")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  //Calculate total Value Budget Set Up
  const totalValueBudgetUsed = Object.values(categoryBudgetUsedTotals).reduce(
    (total, value) => total + value,
    0
  );

  //====================================================

  //Find Total Budget Set Up
  //====================================================
  // Calculate total Budget Set Up as a collection of object
  const categoryBudgetTotalSet = transactions.reduce((acc, transaction) => {
    if (transaction.category.includes("Budget")) {
      const category = "Total Budget Set";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);
  //Calculate total Value Budget Set Up
  const totalValueBudgetSet = categoryBudgetTotalSet["Total Budget Set"];
  //====================================================

  //Find Total Leftover Budget
  //====================================================
  const totalValueBudgetLeftover = totalValueBudgetSet - totalValueBudgetUsed;
  //====================================================

  //Feed Data used and Leftover
  //====================================================
  const dataCategoryAFeed = [
    { name: "Used", value: totalValueBudgetUsed },
    { name: "Leftover", value: totalValueBudgetLeftover },
  ];
  const categoryAFeedAllAdd = [
    { name: "Leftover", value: totalValueBudgetLeftover },
  ];
  //======================================================================

  // Recharts use array format
  const dataCategoryAFeedAllArray = Object.entries(
    categoryBudgetUsedTotals
  ).map(([name, value]) => ({
    name,
    value,
  }));
  const dataCategoryAFeedAll = [
    ...dataCategoryAFeedAllArray,
    ...categoryAFeedAllAdd,
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="w-full justify-center  min-w-[300px] ">
      <HeaderSwitch
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={"Budget Used / Total Budget Set"}
      ></HeaderSwitch>
      {isVisible && (
        <>
          <div className="flex max-sm:flex-col items-center gap-4 py-4 justify-center w-full bg-white border border-gray-200">
            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryAFeed}
              totalValue={totalValueBudgetSet}
              height={200}
              width={400}
            ></CategoryFeedPieChart>

            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryAFeedAll}
              totalValue={totalValueBudgetSet}
              height={300}
              width={400}
            ></CategoryFeedPieChart>
          </div>

          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget set is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueBudgetSet ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Used is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueBudgetUsed ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Leftover is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueBudgetLeftover ?? 0).toFixed(2)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
