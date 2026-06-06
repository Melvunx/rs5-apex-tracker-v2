"use client";

import {
  ChartData,
  TimeRange,
  formatedDate,
} from "@/config/chart-utils.config";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "./ui/chart";
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

type TooltipPayload = {
  payload: ChartData;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

// Tooltip custom pour afficher session + date + précision
function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const { session, day, accuracy, weaponName } = payload[0].payload;

  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 shadow-md text-sm">
      <p className="text-muted-foreground italic mb-1">
        Session {session} — {formatedDate(new Date(day))}
      </p>
      <p className="font-semibold text-foreground mb-1">{weaponName}</p>
      <p className="font-semibold text-primary">
        Précision : {accuracy.toFixed(2)} %
      </p>
    </div>
  );
}

export function ChartStarts({ data, isLoading }: ChartProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Spinner /> Chargement du graphique...
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 15, right: 15 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="session"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `#${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          dataKey="accuracy"
          type="natural"
          fill="var(--chart-1)"
          fillOpacity={0.4}
          stroke="var(--chart-1)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
