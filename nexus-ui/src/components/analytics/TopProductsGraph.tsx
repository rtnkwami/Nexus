"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

const chartConfig = {
  totalSold: {
    label: "Units Sold",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Custom tick component for wrapping text
const CustomTick = (props) => {
  const { x, y, payload } = props;
  const words = payload.value.split(' ');
  const lineHeight = 14;
  const maxWidth = 80; // Adjust based on your needs
  
  // Simple word wrapping logic
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    // Rough character width estimation (you can adjust this)
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
  // Transform API data for the chart
  const chartData = topProductsData?.topProducts?.map(product => ({
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
              bottom: 60, // Increased bottom margin for wrapped text
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={<CustomTick />}
              height={1} // Increased height for wrapped text
              interval={0} // Show all ticks
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalSold" fill="var(--color-totalSold)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
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