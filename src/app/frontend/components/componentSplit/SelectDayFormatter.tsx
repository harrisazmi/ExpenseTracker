import React, { useState } from "react";
import { Input } from "../ui/Input";

interface ControlledDateInputProps {
  onDateChange?: (date: string) => void;
}

const ControlledDateInput: React.FC<ControlledDateInputProps> = ({
  onDateChange,
}) => {
  const [date, setDate] = useState("");

  const formatDate = (inputDate: string) => {
    if (!inputDate) return "";
    // Create a date object from the input
    const dateObj = new Date(inputDate);
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    // Format as YYYY-MM-DD for consistent storage
    return dateObj.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Set the raw input value to maintain native date picker functionality
    setDate(inputValue);

    // Call onDateChange if provided
    if (onDateChange) {
      const formattedDate = formatDate(inputValue);
      onDateChange(formattedDate);
    }
  };

  return (
    <Input
      type="date"
      value={date}
      onChange={handleDateChange}
      className="flex-grow focus:ring-2 focus:ring-indigo-500"
    />
  );
};

export default ControlledDateInput;
