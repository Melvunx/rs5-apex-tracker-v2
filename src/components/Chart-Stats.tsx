"use client";

import {
  ChartData,
  TimeRange,
  formatedDate,
  getMinTickGap,
} from "@/config/chart-utils.config";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Spinner } from "./ui/spinner";

type ChartProps = {
  data: ChartData[];
  isLoading: boolean;
  timeRange: TimeRange;
};

const chartConfig = {
  accuracy: {
    label: "Précision",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartStarts({ data, isLoading, timeRange }: ChartProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Spinner /> Chargement du graphique...
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    day: formatedDate(new Date(item.day)),
  }));

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={formattedData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={getMinTickGap(timeRange)}
          tickFormatter={(value) => value.slice(0, 6)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelClassName="text-indigo-200 italic"
              indicator="line"
            />
          }
        />
        <Area
          dataKey="accuracy"
          type="natural"
          fill="var(--chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
