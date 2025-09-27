"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Eye, X, TrendingUp, DollarSign, ShoppingCart, Users, Lightbulb, ChevronRight, AlertTriangle } from "lucide-react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import TotalRevenueCard from "@/components/analytics/overview/TotalRevenueCard";
import RepeatPurchaseCard from "@/components/analytics/overview/RepeatPurchaseRate";
import AOVCard from "@/components/analytics/overview/AOVCard";
import { ChartBarLabel } from "@/components/analytics/overview/TopProductsGraph";
import { ProductsPerformanceTable } from "@/components/analytics/overview/ProductsPerformanceTable";

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
      repeatPurchaseRate: {
        rate: number;
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
  
  // Insights slider state
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

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

  const fetchInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    
    try {
      const token = await getAccessToken();
      
      // Replace with your actual insights endpoint
      const response = await fetch('http://localhost:5000/analytics/overview?insights=true', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data.insights);
      setInsights(data.insights);
      setIsInsightsOpen(true);
    } catch (err: any) {
      setInsightsError(err.message);
      // Still open the slider to show the error with mock data
      setIsInsightsOpen(true);
    } finally {
      setInsightsLoading(false);
    }
  };

  const closeInsightsSlider = () => {
    setIsInsightsOpen(false);
  };

  const getInsightIcon = (metricName: string) => {
    const name = metricName.toLowerCase();
    if (name.includes('revenue')) return <DollarSign className="w-5 h-5" />;
    if (name.includes('order')) return <ShoppingCart className="w-5 h-5" />;
    if (name.includes('customer') || name.includes('purchase')) return <Users className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  const getTrendColor = (status: string) => {
    return status === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-800';
      case 'negative': return 'text-red-800';
      default: return 'text-blue-800';
    }
  };

  const displayInsights = insights || (insightsError ? null : null);

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
    <div className="p-6 relative">
      {/* View Insights Button */}
      <div className="mb-6">
        <button
          onClick={fetchInsights}
          disabled={insightsLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {insightsLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading Insights...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              View Insights
            </>
          )}
        </button>
      </div>

      {/* Insights Slider */}
      <div className={`fixed inset-0 z-50 ${isInsightsOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isInsightsOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={closeInsightsSlider}
        />
        
        {/* Slider Panel */}
        <div className={`absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
          isInsightsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Business Insights</h2>
              <button
                onClick={closeInsightsSlider}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {insightsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading insights...</span>
                  </div>
                </div>
              ) : displayInsights?.businessInsights ? (
                <div className="space-y-6">
                  {/* Primary Insight */}
                  <div className={`p-4 rounded-lg border ${getStatusColor(displayInsights.businessInsights.primaryInsight.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium ${getStatusTextColor(displayInsights.businessInsights.primaryInsight.status)}`}>
                        {displayInsights.businessInsights.primaryInsight.title}
                      </h3>
                      {displayInsights.businessInsights.primaryInsight.metricValue && (
                        <span className={`font-semibold ${getTrendColor(displayInsights.businessInsights.primaryInsight.status)}`}>
                          {displayInsights.businessInsights.primaryInsight.metricValue}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${getStatusTextColor(displayInsights.businessInsights.primaryInsight.status)}`}>
                      {displayInsights.businessInsights.primaryInsight.message}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      {displayInsights.businessInsights.keyMetrics?.map((metric: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                              {getInsightIcon(metric.name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {metric.name.split('(')[0].trim()}
                                  </h4>
                                  {metric.definition && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {metric.definition}
                                    </p>
                                  )}
                                  {!metric.definition && metric.name.includes('(') && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {metric.name.split('(')[1]?.replace(')', '')}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-3">
                                  <div className="font-semibold text-gray-900">{metric.value}</div>
                                  <div className={`text-sm font-medium ${getTrendColor(metric.status)}`}>
                                    {metric.change}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {displayInsights.businessInsights.recommendations?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Recommendations
                      </h3>
                      <div className="space-y-3">
                        {displayInsights.businessInsights.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                            <ChevronRight className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800">{rec.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* System Note */}
                  {displayInsights.businessInsights.systemNote && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 text-sm font-medium">Anomalies</p>
                          <p className="text-amber-700 text-sm mt-1">
                            {displayInsights.businessInsights.systemNote.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {insightsError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-red-800 text-sm">
                        <strong>Note:</strong> Unable to fetch live insights ({insightsError}). 
                        Showing sample data for demonstration.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No insights available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Original Analytics Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
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
          <RepeatPurchaseCard
            rate={data.dashboard.repeatPurchaseRate.rate}
            percentageChange={data.dashboard.repeatPurchaseRate.percentageChange}
            trend={data.dashboard.repeatPurchaseRate.trend}
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