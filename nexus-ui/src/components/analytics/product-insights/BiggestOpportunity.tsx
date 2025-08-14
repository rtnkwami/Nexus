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
    <Card className="p-1.5">
      <CardContent className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">Biggest Opportunity</p>

        <h2 className="text-lg font-semibold">{biggestOpportunity.product_name}</h2>

        <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
                {biggestOpportunity.missed_opportunity}
            </span>
            <span className="text-base text-muted-foreground">
                potential sales
            </span>
        </div>
      </CardContent>
    </Card>
  );
}