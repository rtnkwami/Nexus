"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface HistoricalRevenueGraphProps {
  data: {
    period: string; // date string
    revenue: string | number;
  }[];
}

const chartConfig = {
  revenue: {
    label: "GHS",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function HistoricalRevenueGraph({ data }: HistoricalRevenueGraphProps) {
  // Transform API data -> recharts format
  const chartData = data.map((item) => ({
    date: new Date(item.period).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: Number(item.revenue),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Revenue</CardTitle>
        <CardDescription>
          Showing {chartData.length} data points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Revenue over selected range
        </div>
      </CardFooter>
    </Card>
  );
}
