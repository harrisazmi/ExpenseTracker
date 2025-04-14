'use client'
import React, { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Switch } from "../ui/Switch";

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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="w-full justify-center">
      <div className="p-4 bg-gray-50 border font-semibold text-gray-800 justify-between items-center flex">
        Utilities Used / Total Budget Utilities
        <div className="flex items-center space-x-2">
          <span>Show Details</span>
          <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </div>
      {isVisible && (
        <>
          <div className="flex">
            <PieChart width={800} height={700}>
              <Pie
                data={dataCategoryCFeedMain}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name} (${(
                    (value / totalValueUtilitiesBudget) *
                    100
                  ).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCategoryCFeedMain.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `RM ${value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}`
                }
              />
              <Legend />
            </PieChart>

            <PieChart width={800} height={700}>
              <Pie
                data={dataCategoryCFeedAll}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name} (${(
                    (value / totalValueUtilitiesBudget) *
                    100
                  ).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCategoryCFeedAll.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `RM ${value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}`
                }
              />
              <Legend />
            </PieChart>
          </div>

          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Utilities Used is&nbsp;
            <div className="text-blue-500">
              RM {totalValueUtilitiesUsed.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Utilities is&nbsp;
            <div className="text-blue-500">
              RM {totalValueUtilitiesBudget.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Utilities Leftover is&nbsp;
            <div className="text-blue-500">
              RM {totalValueUtilitiesBudgetLeftover.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Utilities Leftover is&nbsp;
            <div className="text-blue-500">
              | {utilitiesLeftover.join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
