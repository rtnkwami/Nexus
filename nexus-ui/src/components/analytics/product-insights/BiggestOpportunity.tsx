import { Card, CardContent } from "@/components/ui/card";

export default function BiggestOpportunityCard({ biggestOpportunity }) {
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

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-1 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                Biggest Opportunity
              </h3>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {biggestOpportunity?.missed_opportunity || '0'}
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {biggestOpportunity?.product_name || 'No data'} potential sales
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}