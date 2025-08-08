"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import TotalRevenueCard from "@/components/analytics/TotalRevenueCard";
import AOVCard from "@/components/analytics/AOVCard";
import { ChartBarLabel } from "@/components/analytics/TopProductsGraph";
import { ProductsPerformanceTable } from "@/components/analytics/ProductsPerformanceTable";
import { get } from "http";

const getPeriodLabel = (period: string) => {
  switch (period) {
    case "yearly":
      return "vs last year";
    case "monthly":
      return "vs last month";
    case "weekly":
      return "vs last week";
    case "daily":
      return "vs yesterday";
    default:
      return `vs last ${period}`;
  }
};

export default function AnalyticsOverviewPage() {
  const [data, setData] = useState<{
    dashboard: {
      revenueOverview: {
        totalRevenue: number;
        percentageChange: number;
        trend: "up" | "down" | "stable";
      },
      aovOverview: {
        avgOrderValue: number;
        percentageChange: number;
        trend: "up" | "down" | "stable";
      },
      topProductsOverview: {
        byPopularity: Array<object>,
        byAppearances: Array<object>;
      },
      period: string;
    }
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = await getAccessToken();

        const res = await fetch("http://localhost:5000/analytics/overview", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log(result)
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch revenue data:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading revenue data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <CardContent>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-red-600">Error Loading Data</h3>
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <CardContent>
            <p className="text-center text-gray-600">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div>Overview</div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <TotalRevenueCard
              revenue={data.dashboard.revenueOverview.totalRevenue}
              percentageChange={data.dashboard.revenueOverview.percentageChange}
              trend={data.dashboard.revenueOverview.trend}
              periodLabel={getPeriodLabel(data.dashboard.period)}
            />
          </div>
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <AOVCard
              aov={data.dashboard.aovOverview.avgOrderValue}
              percentageChange={data.dashboard.aovOverview.percentageChange}
              trend={data.dashboard.aovOverview.trend}
              periodLabel={getPeriodLabel(data.dashboard.period)}
            />
          </div>
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <AOVCard
              aov={data.dashboard.aovOverview.avgOrderValue}
              percentageChange={data.dashboard.aovOverview.percentageChange}
              trend={data.dashboard.aovOverview.trend}
              periodLabel={getPeriodLabel(data.dashboard.period)}
            />
          </div>
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <ChartBarLabel
              topProductsData={data.dashboard.topProductsOverview}
            />
          </div>
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <ProductsPerformanceTable
              productsData={data.dashboard.topProductsOverview.byAppearances}
              period={getPeriodLabel(data.dashboard.period)}
            />
          </div>
      </div>
    </div>
  );
}
