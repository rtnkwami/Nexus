import { Card, CardContent } from "@/components/ui/card";

export default function MostViewedCard({ rankings }) {
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

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">Most Viewed Product</p>

        <h2 className="text-lg font-semibold">{topProduct.product_name}</h2>
        <p className="text-sm text-gray-500">Category: {topProduct.product_category}</p>

        <p className={`text-2xl font-bold`}>
          {topProduct.view_count} views
        </p>
      </CardContent>
    </Card>
  );
}