import { Card, CardContent } from "@/components/ui/card";

export default function LeastViewedProduct({ leastViewedProduct }) {
  if (!leastViewedProduct) {
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

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-0 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📉</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                Least Viewed Product
              </h3>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {leastViewedProduct?.view_count || '0'}
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {leastViewedProduct?.product_name || 'No data'} views
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}