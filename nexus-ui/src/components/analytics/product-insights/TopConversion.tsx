import { Card, CardContent } from "@/components/ui/card";

function getConversionRateColor(rate: number) {
  if (rate < 1) return "text-red-700"; // Very Bad
  if (rate >= 1 && rate < 1.5) return "text-orange-600"; // Bad
  if (rate >= 1.5 && rate < 3) return "text-yellow-500"; // Stable
  return "text-green-600"; // Good
}

export default function TopConversionCard({ highestConversionProduct }) {
  if (!highestConversionProduct) {
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

  const rate = parseFloat(highestConversionProduct.conversion_rate);

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-0 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
              Highest Conversion Rate
            </h3>
            <div className={`text-3xl font-bold ${getConversionRateColor(rate)} mb-1`}>
              {rate.toFixed(2) || '0'}%
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {highestConversionProduct.product_name || 'No data'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}