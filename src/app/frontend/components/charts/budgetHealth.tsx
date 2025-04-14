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
    <div className="w-full justify-center">
      <div className="p-4 bg-gray-50 border font-semibold text-gray-800 justify-between items-center flex">
        Health Used / Total Budget Health
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
                  `${name} (${((value / totalValueHealthBudget) * 100).toFixed(
                    0
                  )}%)`
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
                  `${name} (${((value / totalValueHealthBudget) * 100).toFixed(
                    0
                  )}%)`
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
            Total Health Used is&nbsp;
            <div className="text-blue-500">
              RM {totalValueHealthUsed.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Health is&nbsp;
            <div className="text-blue-500">
              RM {totalValueHealthBudget.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Health Leftover is&nbsp;
            <div className="text-blue-500">
              RM {totalValueHealthBudgetLeftover.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Health Leftover is&nbsp;
            <div className="text-blue-500">
              | {healthLeftover.join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
