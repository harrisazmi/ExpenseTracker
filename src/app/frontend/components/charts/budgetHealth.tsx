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

export default function BudgetHealthChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);
  //Category B - Calculate for Health Used/Health Total Budget Health
  //======================================================================

  //Find Total Health Used
  //Calculate Total Health Used as collection of object
  const categoryHealthUsed = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Health") &&
      !transaction.category.includes("Budget")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const healthList = ["Medical Card", "Outpatient", "Vaccine", "Medicine"];

  const healthLeftover = healthList.filter(
    (health) =>
      !Object.keys(categoryHealthUsed).some((category) =>
        category.includes(health)
      )
  );

  //calculate Total Value of Health Used
  const totalValueHealthUsed = Object.values(categoryHealthUsed).reduce(
    (total, value) => total + value,
    0
  );

  //Find Total Health Budget Set Up
  const categoryHealthBudget = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Budget") &&
      transaction.category.includes("Health")
    ) {
      const category = "Health Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalValueHealthBudget = categoryHealthBudget["Health Budget"];
  const totalValueHealthBudgetLeftover =
    totalValueHealthBudget - totalValueHealthUsed;

  //Feed Data used and Leftover
  const dataCategoryCFeedMain = [
    { name: "Used", value: totalValueHealthUsed },
    { name: "Leftover", value: totalValueHealthBudgetLeftover },
  ];

  const categoryBFeedAllAdd = [
    { name: "Leftover", value: totalValueHealthBudgetLeftover },
  ];

  // Recharts use array format
  const dataCategoryCFeedAllArray = Object.entries(categoryHealthUsed).map(
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
        title={"Health Used / Total Budget Health"}
      ></HeaderSwitch>
      {isVisible && (
        <>
          <div className="flex max-sm:flex-col items-center gap-4 py-4 justify-center w-full bg-white border border-gray-200">
            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedMain}
              totalValue={totalValueHealthBudget}
              height={300}
              width={300}
            ></CategoryFeedPieChart>

            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedAll}
              totalValue={totalValueHealthBudget}
              height={300}
              width={300}
            ></CategoryFeedPieChart>
          </div>

          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Health Used is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueHealthUsed ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Health is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueHealthBudget ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Total Budget Health Leftover is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueHealthBudgetLeftover ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border">
            Health Leftover is&nbsp;
            <div className="text-blue-500">
              | {(healthLeftover ?? []).join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
