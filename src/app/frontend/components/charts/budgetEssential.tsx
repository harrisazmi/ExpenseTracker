"use client"
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

export default function BudgetEssentialChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);
  //Category B - Calculate for Essentials Used/Essentials Total Budget Essentials
  //======================================================================

  //Find Total Essentials Used
  //Calculate Total Essentials Used as collection of object
  const categoryEssentialsUsed = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Essentials") &&
      !transaction.category.includes("Budget")
    ) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const essentialsList = [
    "House Rent",
    "Parking Rent",
    "Kiddocare",
    "Childcare",
    "Belanja Dalila",
  ];
  const essentialsLeftover = essentialsList.filter(
    (essentials) =>
      !Object.keys(categoryEssentialsUsed).some((category) =>
        category.includes(essentials)
      )
  );

  //calculate Total Value of Essentials Used
  const totalValueEssentialsUsed = Object.values(categoryEssentialsUsed).reduce(
    (total, value) => total + value,
    0
  );

  //Find Total Essentials Budget Set Up
  const categoryEssentialsBudget = transactions.reduce((acc, transaction) => {
    if (
      transaction.category.includes("Budget") &&
      transaction.category.includes("Essential")
    ) {
      const category = "Essentials Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);
  const totalValueEssentialsBudget =
    categoryEssentialsBudget["Essentials Budget"];
  const totalValueEssentialsBudgetLeftover =
    totalValueEssentialsBudget - totalValueEssentialsUsed;

  //Feed Data used and Leftover
  const dataCategoryBFeedMain = [
    { name: "Used", value: totalValueEssentialsUsed },
    { name: "Leftover", value: totalValueEssentialsBudgetLeftover },
  ];

  const categoryBFeedAllAdd = [
    { name: "Leftover", value: totalValueEssentialsBudgetLeftover },
  ];

  // Recharts use array format
  const dataCategoryBFeedAllArray = Object.entries(categoryEssentialsUsed).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const dataCategoryBFeedAll = [
    ...dataCategoryBFeedAllArray,
    ...categoryBFeedAllAdd,
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="w-full justify-center">
      <div className="p-4 bg-gray-50 border font-semibold text-gray-800 justify-between items-center flex">
        Essentials Used / Total Budget Essentials
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
                data={dataCategoryBFeedMain}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name} (${(
                    (value / totalValueEssentialsBudget) *
                    100
                  ).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCategoryBFeedMain.map((entry, index) => (
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
                data={dataCategoryBFeedAll}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name} (${(
                    (value / totalValueEssentialsBudget) *
                    100
                  ).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCategoryBFeedAll.map((entry, index) => (
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
            Total Essentials Used is&nbsp;
            <div className="text-blue-500">
              RM {totalValueEssentialsUsed.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Essentials is&nbsp;
            <div className="text-blue-500">
              RM {totalValueEssentialsBudget.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Essentials Leftover is&nbsp;
            <div className="text-blue-500">
              RM {totalValueEssentialsBudgetLeftover.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Essentials Leftover is&nbsp;
            <div className="text-blue-500">
              | {essentialsLeftover.join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
