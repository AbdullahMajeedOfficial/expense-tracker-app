"use client";

import type { FC } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SpendingByCategory } from "@/lib/types";
import { PieChartIcon } from "lucide-react";

interface SpendingChartProps {
  data: SpendingByCategory;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const SpendingChart: FC<SpendingChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([category, amount], index) => ({
    name: category,
    value: amount,
    fill: chartColors[index % chartColors.length],
  }));

  const chartConfig = Object.fromEntries(
    chartData.map(item => [item.name.toLowerCase(), { label: item.name, color: item.fill }])
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <PieChartIcon className="w-6 h-6" />
            Spending Breakdown
        </CardTitle>
        <CardDescription>
            A look at where your money is going this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No spending data available.
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
