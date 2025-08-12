"use client"

import { TrendingUp } from "lucide-react"
// 1. Import the `Cell` component from recharts
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// The config is still useful for the label in the tooltip
const chartConfig = {
  totalSold: {
    label: "Units Sold",
  },
} satisfies ChartConfig;

// Custom tick component for wrapping text (no changes needed here)
const CustomTick = (props) => {
  const { x, y, payload } = props;
  const words = payload.value.split(' ');
  const lineHeight = 14;
  const maxWidth = 80;
  
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length * 6 > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * lineHeight}
          dy={0}
          textAnchor="middle"
          fill="#666"
          fontSize="12"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export function ChartBarLabel({ topProductsData }) {
  // 2. Define your color palette
  const colors = ["#2563eb", "#84cc16", "#f97316", "#d946ef", "#14b8a6"]; // Blue, Green, Orange, Purple, Teal

  const chartData = topProductsData?.byPopularity?.map(product => ({
    name: product.name,
    totalSold: product.totalSold
  })) || [];

  const period = topProductsData?.period || 'month';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Products</CardTitle>
        <CardDescription>For this {period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={<CustomTick />}
              height={1}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* 3. Render a <Cell> for each data point inside the <Bar> */}
            <Bar dataKey="totalSold" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Top selling products this {period} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing units sold for top 5 products
        </div>
      </CardFooter>
    </Card>
  )
}