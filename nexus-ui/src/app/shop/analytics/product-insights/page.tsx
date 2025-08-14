"use client";

import { useState, useEffect } from "react";
import SalesPerformanceFilter from "@/components/analytics/salesPerformance/SalesPerformanceFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import TopConversionCard from "@/components/analytics/product-insights/TopConversion";

export default function ProductInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<{
    from: Date;
    to: Date;
    granularity: string;
  } | null>(null);

  const fetchProductInsightsData = async (params: {
    from: Date;
    to: Date;
    granularity: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();

      const query = new URLSearchParams({
        fromDate: params.from.toISOString(),
        toDate: params.to.toISOString(),
        granularity: params.granularity,
      }).toString();

      const res = await fetch(
        `http://localhost:5000/analytics/product-insights?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log(result);
      setData(result);
    } catch (err: any) {
      console.error("Failed to fetch product insights data:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    if (filterParams) {
      fetchProductInsightsData(filterParams);
    }
  }, [filterParams]);

  return (
    <div className="p-4">
      <SalesPerformanceFilter onFilterChange={setFilterParams} />

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading product insights data...</span>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <Card className="p-6">
            <CardContent>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-red-600">
                  Error Loading Data
                </h3>
                <p className="text-sm text-gray-600">{error}</p>
                <button
                  onClick={() =>
                    filterParams && fetchProductInsightsData(filterParams)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {data && !loading && !error && (
        <div className="p-6">
          <TopConversionCard rankings={data.dashboard.conversionRankings} />
        </div>
      )}
    </div>
  );
}
