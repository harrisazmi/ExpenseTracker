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

export default function BudgetInputMoneyChart({ transactions = [] }: Props) {
  // State to control visibility
  const [isVisible, setIsVisible] = useState(false);

  //Category B - Calculate for InputMoney Input/InputMoney Total Budget InputMoney
  //======================================================================

  //Find Total InputMoney Input
  //Calculate Total InputMoney Input as collection of object
  const categoryInputInputMoney = transactions.reduce((acc, transaction) => {
    if (transaction.category.includes("InputMoney")) {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  //For Showing List of items not key in yet
  const InputMoneyList = [
    "Dalila Salary",
    "Harris Salary",
    "Claim",
    "Gift",
    "Part Time",
    "Etc",
  ];

  const InputMoneyLeftover = InputMoneyList.filter(
    (InputMoney) =>
      !Object.keys(categoryInputInputMoney).some((category) =>
        category.includes(InputMoney)
      )
  );

  //calculate Total Value of InputMoney Input
  const totalValueInputMoney = Object.values(categoryInputInputMoney).reduce(
    (total, value) => total + value,
    0
  );

  //Find Total InputMoney Budget Set Up
  const categoryInputMoneyBudget = transactions.reduce((acc, transaction) => {
    if (transaction.category.includes("Budget")) {
      const category = "InputMoney Budget";
      acc[category] = (acc[category] || 0) + transaction.expenses;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalValueInputMoneyBudget =
    categoryInputMoneyBudget["InputMoney Budget"];
  const totalValueSpare = totalValueInputMoney - totalValueInputMoneyBudget;

  //Feed Data Input and Leftover
  const dataCategoryCFeedMain = [
    { name: "Input", value: totalValueInputMoneyBudget },
    { name: "Leftover", value: totalValueSpare },
  ];

  const categoryBFeedAllAdd = [{ name: "Leftover", value: totalValueSpare }];

  // Recharts use array format
  const dataCategoryCFeedAllArray = Object.entries(categoryInputInputMoney).map(
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
        Total Budget Input Money / Input Money
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
                  `${name} (${((value / totalValueInputMoney) * 100).toFixed(
                    2
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
                  `${name} (${((value / totalValueInputMoney) * 100).toFixed(
                    2
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
            Total InputMoney is&nbsp;
            <div className="text-blue-500">
              RM {totalValueInputMoney.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget InputMoney is&nbsp;
            <div className="text-blue-500">
              RM {totalValueInputMoneyBudget.toFixed(2)}
            </div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            Total Budget InputMoney Leftover is&nbsp;
            <div className="text-blue-500">RM {totalValueSpare.toFixed(2)}</div>
          </div>
          <div className=" flex items-center justify-center p-2 font-semibold border">
            InputMoney Leftover is&nbsp;
            <div className="text-blue-500">
              | {InputMoneyLeftover.join(" | ")} |
            </div>
          </div>
        </>
      )}
    </div>
  );
}
