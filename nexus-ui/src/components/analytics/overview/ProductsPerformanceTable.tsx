"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProductsPerformanceTable({ productsData, title = "Product Performance", period = "monthly" }) {
  if (!productsData || productsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>For this {period}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">No product data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Performance metrics for this {period}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">Product</th>
                <th className="text-right py-3 px-2 font-medium">Revenue</th>
                <th className="text-right py-3 px-2 font-medium">Orders</th>
                <th className="text-right py-3 px-2 font-medium">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((product, index) => (
                <tr key={product.id || index} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-sm flex-shrink-0" 
                        style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                      ></div>
                      <span className="font-medium text-gray-900 truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-sm tabular-nums text-gray-700">
                      {Number(product.totalRevenue ?? 0).toLocaleString("en-GH", {
                        style: "currency",
                        currency: "GHS",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>

                  <td className="text-right py-3 px-2 text-sm tabular-nums text-gray-700">
                      {Number.parseInt(product.appearances ?? 0, 10)}
                  </td>

                  <td className="text-right py-3 px-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {(parseFloat(product.orderFrequency || 0) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}