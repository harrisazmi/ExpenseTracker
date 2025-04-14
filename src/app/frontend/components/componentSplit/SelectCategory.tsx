import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

type MainCategory =
  | "Essentials"
  | "Food"
  | "Utilities"
  | "Savings"
  | "Transport"
  | "Health"
  | "InputMoney";

const categoryMap: Record<MainCategory, string[]> = {
  InputMoney: [
    "Dalila Salary",
    "Harris Salary",
    "Claim",
    "Gift",
    "Part Time",
    "Etc",
  ],
  Essentials: [
    "House Rent",
    "Parking Rent",
    "Kiddocare",
    "Childcare",
    "Belanja Dalila",
    "Budget",
  ],
  Food: ["Groceries", "Eat Out", "Entertainment", "Budget"],
  Utilities: [
    "Electric Bills",
    "Water Bills",
    "Internet Bills",
    "Telco",
    "Icloud",
    "Budget",
  ],
  Savings: [
    "Sinking Fund",
    "Emergency Fund",
    "Harris TH",
    "Harris ASB",
    "Dalila TH",
    "Dalila ASB",
    "Dalila PG",
    "Noah TH",
    "Noah ASB",
    "Noah PG",
    "Budget",
  ],
  Transport: ["Fuel", "Toll", "Maintenance", "Urgent Repair", "Budget"],
  Health: ["Medical Card", "Outpatient", "Vaccine", "Medicine", "Budget"],
};

interface SelectCategoryProps {
  onMainCategoryChange?: (category: MainCategory | "") => void;
  onInnerCategoryChange?: (category: string) => void;
}

export default function SelectCategory({
  onMainCategoryChange,
  onInnerCategoryChange,
}: SelectCategoryProps) {
  const [mainCategory, setMainCategory] = useState<MainCategory | "">("");
  const [innerCategory, setInnerCategory] = useState<string>("");

  const handleMainCategoryChange = (value: MainCategory) => {
    setMainCategory(value);
    setInnerCategory("");
    onMainCategoryChange?.(value);
  };

  const handleInnerCategoryChange = (value: string) => {
    setInnerCategory(value);
    onInnerCategoryChange?.(value);
  };

  return (
    <div>
      <div className="border-b-2 bg-indigo-100 mb-4 p-4 rounded-t-lg">
        <div className="mb-2 text-indigo-800 font-semibold">Main Category</div>
        <Select onValueChange={handleMainCategoryChange}>
          <SelectTrigger className="w-full text-indigo-700 border-indigo-300 focus:ring-2 focus:ring-indigo-500">
            <SelectValue placeholder="Select Your Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.keys(categoryMap).map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="hover:bg-indigo-50 focus:bg-indigo-100"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="border-b-2 bg-indigo-100 p-4 rounded-b-lg">
        <div className="mb-2 text-indigo-800 font-semibold">Inner Category</div>
        <Select
          disabled={!mainCategory}
          onValueChange={handleInnerCategoryChange}
        >
          <SelectTrigger className="w-full text-indigo-700 border-indigo-300 disabled:opacity-50 focus:ring-2 focus:ring-indigo-500">
            <SelectValue
              placeholder={
                mainCategory
                  ? "Select Inner Category"
                  : "Select Main Category First"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {mainCategory &&
                categoryMap[mainCategory].map((innerCat) => (
                  <SelectItem
                    key={innerCat}
                    value={innerCat}
                    className="hover:bg-indigo-50 focus:bg-indigo-100"
                  >
                    {innerCat}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
