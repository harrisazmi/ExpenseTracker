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
    <div className="w-full justify-center">
      <div className="p-4 bg-gray-50 border font-semibold text-gray-800 justify-between items-center flex">
        Transports Used / Total Budget Transports
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
                    (value / totalValueTransportsBudget) *
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
                    (value / totalValueTransportsBudget) *
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
            Total Transports Used is&nbsp;
            <div className="text-blue-500">
              RM {totalValueTransportsUsed.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Transports is&nbsp;
            <div className="text-blue-500">
              RM {totalValueTransportsBudget.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget Transports Leftover is&nbsp;
            <div className="text-blue-500">
              RM {totalValueTransportsBudgetLeftover.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Transport Leftover is&nbsp;
            <div className="text-blue-500">
              | {transportLeftover.join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
