import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

type DataEntry = {
  name: string;
  value: number;
};

type Props = {
  dataCategoryFeed: DataEntry[];
  totalValue: number;
  width?: number;
  height?: number;
};

export default function CategoryFeedPieChart({
  dataCategoryFeed,
  totalValue,
  width = 300,
  height = 200,
}: Props) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={dataCategoryFeed}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, value }) =>
          ` (${((value / totalValue) * 100).toFixed(0)}%)`
        }
        outerRadius="80%"
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
      >
        {dataCategoryFeed.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number) =>
          `RM ${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        }
      />

      <Legend />
    </PieChart>
  );
}
