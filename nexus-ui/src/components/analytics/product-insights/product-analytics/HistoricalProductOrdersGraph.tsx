"use client";

// 1. Removed unused 'Legend' import
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface HistoricalDataGraphProps {
    data: {
        period: string;
        units_sold: string | number;
        orders: string | number;
    }[];
}

const chartConfig = {
    units_sold: {
        label: "Units Sold",
        color: "var(--chart-1)",
    },
    orders: {
        label: "Orders",
        color: "var(--chart-5))",
    },
} satisfies ChartConfig;

export default function HistoricalProductOrdersGraph({ data }: HistoricalDataGraphProps) {
    const chartData = data.map((item) => ({
        date: new Date(item.period).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        units_sold: Number(item.units_sold),
        orders: Number(item.orders),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Units Sold vs. Orders</CardTitle>
                <CardDescription>
                    Showing units sold and total orders over the selected period.
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
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />

                        {/* Line for Units Sold */}
                        <Line
                            dataKey="units_sold"
                            type="monotoneX"
                            stroke="#ff8c00"  // Orange
                            strokeWidth={2}
                            dot={{
                                fill: "#ff8c00",  // Orange
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />

                        {/* Line for Orders */}
                        <Line
                            dataKey="orders"
                            type="monotoneX"
                            stroke="#1e90ff"  // Yellow
                            strokeWidth={2}
                            dot={{
                                fill: "#1e90ff",  // Yellow
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}