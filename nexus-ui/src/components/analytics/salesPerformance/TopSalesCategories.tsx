"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

// 1. UPDATE THE PROPS INTERFACE
// It now expects the new data structure from your API.
interface TopCategoriesGraphProps {
  data: {
    datapoints: { period: string; [key: string]: number | string }[];
    categories: string[];
  };
}

export default function TopCategoriesGraph({ data }: TopCategoriesGraphProps) {
  // Memoize chartConfig to prevent re-computation on every render
  const chartConfig = useMemo(() => {
    const config = {} as ChartConfig;
    // Pre-defined color variables from your global CSS
    const colors = ["#2563eb", "#84cc16", "#f97316", "#d946ef", "#14b8a6"];
    
    // 2. DYNAMICALLY BUILD CHART CONFIG
    // Create a configuration for each category.
    data.categories.forEach((category, index) => {
      config[category] = {
        label: category,
        // Assign a color from the predefined list
        color: colors[index % colors.length],
      };
    });
    return config;
  }, [data.categories]);

  // Transform datapoints for the chart (just date formatting)
  const chartData = data.datapoints.map((item) => ({
    ...item,
    date: new Date(item.period).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
  
  // Handle empty state gracefully
  if (!data || data.categories.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Categories Over Time</CardTitle>
                <CardDescription>No category sales data available for this period.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 w-full flex items-center justify-center">
                <p className="text-muted-foreground">No data to display</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Categories Over Time</CardTitle>
        <CardDescription>
          Showing revenue for top {data.categories.length} categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            
            {/* 3. ADD A CHART LEGEND */}
            <ChartLegend content={<ChartLegendContent />} />

            {/* 4. DYNAMICALLY RENDER A <Line> FOR EACH CATEGORY */}
            {data.categories.map((category) => (
              <Line
                key={category}
                dataKey={category}
                type="monotoneX"
                stroke={chartConfig[category]?.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Revenue from top categories over the selected range
        </div>
      </CardFooter>
    </Card>
  );
}