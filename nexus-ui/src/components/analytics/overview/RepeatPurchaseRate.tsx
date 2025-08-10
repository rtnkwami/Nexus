// components/TotalRevenueCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RepeatPurchaseCard({ rate, percentageChange, trend, periodLabel }) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground">Repeat Purchase Rate</p>

        <div className="text-2xl font-bold tracking-tight">
          {rate.toLocaleString(undefined, { minimumFractionDigits: 0 })}%
        </div>

        <div className="flex items-center space-x-2">
          <TrendIcon className={cn("w-4 h-4", trendColor)} />
          <span className={cn("text-sm font-medium", trendColor)}>
              {percentageChange > 0 ? `+ ${percentageChange}` : percentageChange}%
          </span>
          <span className="text-sm text-muted-foreground">{periodLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
