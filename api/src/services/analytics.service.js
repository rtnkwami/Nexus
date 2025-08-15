import { getOverviewDashboard } from "./analytics/dashboards/overview.js";
import { getSalesPerformanceDashboard } from "./analytics/dashboards/salesPerformance.js";
import { getProductInsightsDashboard, getOneProductAnalytics } from "./analytics/dashboards/productInsights.js";
import { get } from "http";

export const Analytics = {
    getOverviewDashboard,
    getSalesPerformanceDashboard,
    getProductInsightsDashboard,
    getOneProductAnalytics
};