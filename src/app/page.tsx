"use client";
export const runtime = "edge";
import { useEffect, useState } from "react";
import Selections from "./frontend/components/componentSplit/Selection";
import BudgetEssentialChart from "./frontend/components/charts/budgetEssential";
import BudgetFoodChart from "./frontend/components/charts/budgetFood";
import BudgetTotalChart from "./frontend/components/charts/budgetTotal";
import BudgetUtilitiesChart from "./frontend/components/charts/budgetUtilities";
import BudgetTransportChart from "./frontend/components/charts/budgetTransport";
import BudgetForceSavingChart from "./frontend/components/charts/budgetForceSaving";
import BudgetHealthChart from "./frontend/components/charts/budgetHealth";
import BudgetInputMoneyChart from "./frontend/components/charts/budgetInputMoney";
import { Switch } from "./frontend/components/ui/Switch";

// Define the interface for each transaction record
interface TransactionArray {
  _id: string;
  category: string;
  expenses: number;
  date: string;
  remarks: string;
}

// Define the state for transactions as an array of TransactionArray objects
export default function MainPage() {
  const [transactions, setTransactions] = useState<TransactionArray[]>([]); // State to store the actual documents array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/getAllTransactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data: TransactionArray[] = await response.json(); // Expect an array of transactions
        setTransactions(data); // Set the fetched transactions array to state
        setLoading(false);
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // If transactions are still loading, show a loading state
  if (loading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  // If there's an error, display it
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white space-y-6 items-center flex flex-col">
      <Selections />
      <div className="w-full">
        <h1 className="min-w-[300px] w-full bg-white flex text-2xl font-bold p-4 border border-gray-200 text-gray-800 rounded-t-lg items-center justify-between">
          <div className="pr-2">Transactions</div>
          <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        </h1>
        {isVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="p-4  border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-col gap-3 text-sm text-gray-700">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500">Category:</span>
                    <span className="text-right">{transaction.category}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500">Remarks:</span>
                    <span className="text-right truncate max-w-[180px]">
                      {transaction.remarks}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500">Amount:</span>
                    <span className="text-green-600 font-semibold">
                      RM {transaction.expenses}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500">Date:</span>
                    <span className="text-right">{transaction.date}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500">ID:</span>
                    <span className="text-xs text-gray-400 truncate max-w-[180px]">
                      {transaction._id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-gray-200 w-full rounded-lg shadow-sm items-center justify-center flex flex-col">
        <BudgetInputMoneyChart transactions={transactions} />
        <BudgetTotalChart transactions={transactions} />
        <BudgetFoodChart transactions={transactions} />
        <BudgetEssentialChart transactions={transactions} />
        <BudgetForceSavingChart transactions={transactions} />
        <BudgetHealthChart transactions={transactions} />
        <BudgetTransportChart transactions={transactions} />
        <BudgetUtilitiesChart transactions={transactions} />
      </div>
    </div>
  );
}
