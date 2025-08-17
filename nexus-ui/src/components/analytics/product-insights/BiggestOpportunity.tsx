import { Card, CardContent } from "@/components/ui/card";

export default function BiggestOpportunityCard({ biggestOpportunity, onCardClick }) {
  if (!biggestOpportunity) {
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
    if (onCardClick && biggestOpportunity.product_id && biggestOpportunity.product_name) {
      onCardClick({
        id: biggestOpportunity.product_id,
        name: biggestOpportunity.product_name
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
              Biggest Opportunity
            </h3>
            <div className="text-3xl font-bold mb-1">
              {biggestOpportunity?.missed_opportunity || '0'}
              <span className="text-lg font-normal text-gray-600">
                &nbsp;potential sales
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {biggestOpportunity?.product_name || 'No data'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}