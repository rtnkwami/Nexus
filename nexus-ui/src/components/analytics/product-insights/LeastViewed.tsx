import { Card, CardContent } from "@/components/ui/card";

export default function LeastViewedCard({ leastViewedProduct, onCardClick }) {
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

  const handleClick = () => {
    if (onCardClick && leastViewedProduct.product_id && leastViewedProduct.product_name) {
      onCardClick({
        id: leastViewedProduct.product_id,
        name: leastViewedProduct.product_name
      });
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-0 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl"
      onClick={handleClick}
    >
      <CardContent className="p-8">
        <div className="flex items-start space-x-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
              Least Viewed Product
            </h3>
            <div className="text-3xl font-bold mb-1">
              {leastViewedProduct?.view_count || '0'}
              <span className="text-lg font-normal text-gray-600">
                &nbsp;views
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {leastViewedProduct?.product_name || 'No data'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}