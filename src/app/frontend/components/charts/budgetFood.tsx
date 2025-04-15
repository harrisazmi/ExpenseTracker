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

export default function BudgetFoodChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);
  //Category B - Calculate for Foods Used/Foods Total Budget Foods
  //======================================================================

  //Find Total Foods Used
  //Calculate Total Foods Used as collection of object
  const categoryFoodsUsed = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Food") &&
      !transaction.category.includes("Budget")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  //calculate Total Value of Foods Used
  const totalValueFoodsUsed = Object.values(categoryFoodsUsed).reduce(
    (total, value) => total + value,
    0
  );

  //Find Total Foods Budget Set Up
  const categoryFoodsBudget = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Budget") &&
      transaction.category.includes("Food")
    ) {
      const category = "Foods Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalValueFoodsBudget = categoryFoodsBudget["Foods Budget"];
  const totalValueFoodsBudgetLeftover =
    totalValueFoodsBudget - totalValueFoodsUsed;

  //Feed Data used and Leftover
  const dataCategoryCFeedMain = [
    { name: "Used", value: totalValueFoodsUsed },
    { name: "Leftover", value: totalValueFoodsBudgetLeftover },
  ];

  const categoryBFeedAllAdd = [
    { name: "Leftover", value: totalValueFoodsBudgetLeftover },
  ];

  // Recharts use array format
  const dataCategoryCFeedAllArray = Object.entries(categoryFoodsUsed).map(
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
    <div className="w-full  min-w-[300px]  justify-center">
      <HeaderSwitch
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={"Foods Used / Total Budget Foods"}
      ></HeaderSwitch>
      {isVisible && (
        <>
          <div className="flex max-sm:flex-col items-center gap-4 py-4 justify-center w-full bg-white border border-gray-200">
            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedMain}
              totalValue={totalValueFoodsBudget}
            ></CategoryFeedPieChart>

            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedAll}
              totalValue={totalValueFoodsBudget}
            ></CategoryFeedPieChart>
          </div>

          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Foods Used is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueFoodsUsed ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Foods is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueFoodsBudget ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Foods Leftover is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueFoodsBudgetLeftover ?? 0).toFixed(2)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
