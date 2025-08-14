import { Card, CardContent } from "@/components/ui/card";

export default function MostViewedCard({ mostViewedProduct }) {
  if (!mostViewedProduct) {
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
    <Card className="p-1.5">
      <CardContent className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">Most Viewed Product</p>

        <h2 className="text-lg font-semibold">{mostViewedProduct.product_name}</h2>
        {/* <p className="text-sm text-gray-500">Category: {topProduct.product_category}</p> */}

        <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {mostViewedProduct.view_count} 
            </span>
            <span className="text-base text-muted-foreground">
              views
            </span>
        </div>
      </CardContent>
    </Card>
  );
}