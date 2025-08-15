"use client";

import { useState, useEffect, useRef } from "react";
import SalesPerformanceFilter from "@/components/analytics/salesPerformance/SalesPerformanceFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import TopConversionCard from "@/components/analytics/product-insights/TopConversion";
import MostViewedCard from "@/components/analytics/product-insights/MostViewed";
import LeastViewedCard from "@/components/analytics/product-insights/LeastViewed";
import BiggestOpportunityCard from "@/components/analytics/product-insights/BiggestOpportunity";

type TabType = "overview" | "analysis";

export default function ProductInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);

  // 🔹 NEW: suggestion state + debounce ref
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const [filterParams, setFilterParams] = useState<{
    from: Date;
    to: Date;
    granularity: string;
  } | null>(null);

  const wasSelectionMade = useRef(false);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const token = await getAccessToken(); // From your auth utility
        setAccessToken(token);
      } catch (err) {
        console.error("Failed to get access token", err);
      }
    };

    retrieveToken();
  }, []);

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
  
  // 🔹 NEW: fetch suggestions for search
  const fetchSuggestions = async (query: string) => {
    if (!accessToken || !query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      setLoadingSuggestions(true);
      const res = await fetch(`http://localhost:5000/shops/search-suggestions?q=${encodeURIComponent(query)}`,
          {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 🔹 NEW: debounce effect for search
  useEffect(() => {
    if (wasSelectionMade.current) {
      wasSelectionMade.current = false;
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (activeTab === "analysis") {
        fetchSuggestions(searchQuery);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, activeTab]);

  // Fetch data when filters change
  useEffect(() => {
    if (filterParams && activeTab === "overview") {
      fetchProductInsightsData(filterParams);
    }
  }, [filterParams, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (suggestions.length === 0) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault(); // Prevent cursor from moving in the input
      setActiveIndex(prev => (prev >= suggestions.length - 1 ? 0 : prev + 1));
      break;
    case "ArrowUp":
      e.preventDefault(); // Prevent cursor from moving in the input
      setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      break;
    case "Enter":
      e.preventDefault();
      let productToSearch;

      if (activeIndex !== -1) {
        // User selected an item with arrow keys
        productToSearch = suggestions[activeIndex];
      } else if (suggestions.length > 0) {
        // User didn't select but pressed Enter, so we default to the top suggestion
        productToSearch = suggestions[0];
      }

      if (productToSearch) {
        setSearchQuery(productToSearch.name);
        setSelectedProduct(productToSearch);
        setSuggestions([]);
        setActiveIndex(-1);
        wasSelectionMade.current = true;
      }
      break;
    case "Escape":
      setSuggestions([]);
      setActiveIndex(-1);
      break;
  }
};

const fetchProductAnalytics = async (productId: string, params: { from: Date; to: Date }) => {
  setLoading(true); 
  setError(null);

  try {

    if (!params) {
      setError("Please select a date range to see product analytics.");
      setLoading(false);
      return;
    }
    // Note: You already have accessToken in state, no need to get it again
    if (!accessToken) throw new Error("Authentication token not found.");

    const query = new URLSearchParams({
      fromDate: params.from.toISOString(),
      toDate: params.to.toISOString(),
    }).toString();

    console.log(productId)
    
    // 💡 This is the new API call using the product ID
    const res = await fetch(`http://localhost:5000/analytics/product-insights/${productId}?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    setData(result); // Update your main data state with the new analytics
  } catch (err: any) {
    console.error("Failed to fetch product analytics:", err);
    setError(err.message || "Unknown error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (selectedProduct && filterParams) {
    fetchProductAnalytics(selectedProduct.id, filterParams);
  }
}, [selectedProduct, filterParams]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Date Filter, Search, and Tabs */}
      <div className="space-y-6 mb-8">
        {/* Top Row: Toggle and Date Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "analysis"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Product Analysis
            </button>
          </div>

          {/* Date Filter */}
          <div className="flex-shrink-0">
            <SalesPerformanceFilter onFilterChange={setFilterParams} />
          </div>
        </div>

        {/* Search Bar - Only show for Product Analysis */}
        {activeTab === "analysis" && (
          <div className="flex justify-center relative">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter a product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full"
              />
              {loadingSuggestions && (
                <div className="absolute right-3 top-2 text-sm text-gray-400">
                  Loading...
                </div>
              )}

              {/* Suggestion dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        wasSelectionMade.current = true;
                        setSelectedProduct(item)
                        setSearchQuery(item.name);
                        setSuggestions([]);
                      }}
                      className={`px-4 py-2 cursor-pointer ${
                        idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          <span className="text-gray-600">Loading product insights data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-red-600">
                  Error Loading Data
                </h3>
                <p className="text-sm text-gray-600">{error}</p>
                <button
                  onClick={() =>
                    filterParams && fetchProductInsightsData(filterParams)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content based on active tab */}
      {!loading && !error && (
        <>
          {activeTab === "overview" && data && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <TopConversionCard highestConversionProduct={data.dashboard.highestConversionProduct} />
                <MostViewedCard mostViewedProduct={data.dashboard.mostViewedProduct} />
                <LeastViewedCard leastViewedProduct={data.dashboard.leastViewedProduct} />
                <BiggestOpportunityCard biggestOpportunity={data.dashboard.biggestOpportunity} />
              </div>
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="space-y-6">
              {searchQuery ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">
                    Analytics for "{searchQuery}"
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Detailed analytics and charts would go here
                  </p>
                  <div className="bg-gray-50 rounded-lg p-8">
                    <p className="text-gray-500">
                      Product analytics dashboard coming soon...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-600">
                    Search for a Product
                  </h3>
                  <p className="text-gray-500">
                    Enter a product name or category to view detailed analytics
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
