import { Card, CardContent } from "@/components/ui/card";

function getConversionRateColor(rate: number) {
  if (rate < 1) return "text-red-700"; // Very Bad
  if (rate >= 1 && rate < 1.5) return "text-orange-600"; // Bad
  if (rate >= 1.5 && rate < 3) return "text-yellow-500"; // Stable
  return "text-green-600"; // Good
}

export default function TopConversionCard({ rankings }) {
  if (!rankings || rankings.length === 0) {
    return (
      <Card className="p-4">
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No conversion data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const topProduct = rankings[0];
  const rate = parseFloat(topProduct.conversion_rate);

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">Highest Conversion Rate</p>

        <h2 className="text-lg font-semibold">{topProduct.product_name}</h2>
        <p className="text-sm text-gray-500">Category: {topProduct.product_category}</p>

        <p className={`text-2xl font-bold ${getConversionRateColor(rate)}`}>
          {rate.toFixed(2)}%
        </p>
      </CardContent>
    </Card>
  );
}