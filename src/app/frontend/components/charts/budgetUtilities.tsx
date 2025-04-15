"use client";
import React, { useState } from "react";
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

export default function BudgetUtilitiesChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);
  //Category B - Calculate for Utilities Used/Utilities Total Budget Utilities
  //======================================================================

  //Find Total Utilities Used
  //Calculate Total Utilities Used as collection of object
  const categoryUtilitiesUsed = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Utilities") &&
      !transaction.category.includes("Budget")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const utilitiesList = [
    "Electric Bills",
    "Water Bills",
    "Internet Bills",
    "Telco",
    "Icloud",
  ];

  const utilitiesLeftover = utilitiesList.filter(
    (utility) =>
      !Object.keys(categoryUtilitiesUsed).some((category) =>
        category.includes(utility)
      )
  );

  //calculate Total Value of Utilities Used
  const totalValueUtilitiesUsed = Object.values(categoryUtilitiesUsed).reduce(
    (total, value) => total + value,
    0
  );

  //Find Total Utilities Budget Set Up
  const categoryUtilitiesBudget = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Budget") &&
      transaction.category.includes("Utilities")
    ) {
      const category = "Utilities Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalValueUtilitiesBudget = categoryUtilitiesBudget["Utilities Budget"];
  const totalValueUtilitiesBudgetLeftover =
    totalValueUtilitiesBudget - totalValueUtilitiesUsed;

  //Feed Data used and Leftover
  const dataCategoryCFeedMain = [
    { name: "Used", value: totalValueUtilitiesUsed },
    { name: "Leftover", value: totalValueUtilitiesBudgetLeftover },
  ];

  const categoryBFeedAllAdd = [
    { name: "Leftover", value: totalValueUtilitiesBudgetLeftover },
  ];

  // Recharts use array format
  const dataCategoryCFeedAllArray = Object.entries(categoryUtilitiesUsed).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const dataCategoryCFeedAll = [
    ...dataCategoryCFeedAllArray,
    ...categoryBFeedAllAdd,
  ];

  return (
    <div className="w-full justify-center  min-w-[300px] ">
      <HeaderSwitch
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={"Utilities Used / Total Budget Utilities"}
      ></HeaderSwitch>

      {isVisible && (
        <>
          <div className="flex max-sm:flex-col items-center gap-4 py-4 justify-center w-full bg-white border border-gray-200">
            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedMain}
              totalValue={totalValueUtilitiesBudget}
            ></CategoryFeedPieChart>

            <CategoryFeedPieChart
              dataCategoryFeed={dataCategoryCFeedAll}
              totalValue={totalValueUtilitiesBudget}
            ></CategoryFeedPieChart>
          </div>

          <div className="flex items-center justify-center p-2 font-semibold border bg-white">
            Total Utilities Used is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueUtilitiesUsed ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-center p-2 font-semibold border bg-white">
            Total Budget Utilities is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueUtilitiesBudget ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center max-sm:flex-col justify-center p-2 font-semibold border bg-white">
            Total Budget Utilities Leftover is&nbsp;
            <div className="text-blue-500">
              RM {(totalValueUtilitiesBudgetLeftover ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="flex max-sm:flex-col items-center justify-center p-2 font-semibold border bg-white">
            Utilities Leftover is&nbsp;
            <div className="text-blue-500">
              | {(utilitiesLeftover ?? []).join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
