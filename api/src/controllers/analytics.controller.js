import { getUserShopId } from "../utils/getUserShop.js"
import { Analytics } from "../services/analytics.service.js";

export const overviewDashboard = async (req, res) => {
    try {
        const shopId = await getUserShopId(req);
        const period = req.query.period;
        const isInsights = req.query.insights;

        const dashboardData = await Analytics.getOverviewDashboard(shopId, period);

        if (isInsights) { 
            const insights = await Analytics.getDashboardInsights(dashboardData);
            
            console.log(insights)

            return res.status(200).json({
                insights
            });
        }

        return res.status(200).json({
            dashboard: dashboardData
        });

    } catch (error) {
        console.error("Error getting Overview Dashboard: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const salesPerformanceDashboard = async (req, res) => {
    try {
        const shopId = await getUserShopId(req);
        const fromDate = decodeURIComponent(req.query.fromDate);
        const toDate = decodeURIComponent(req.query.toDate);
        const { granularity } = req.query;

        const dashboardData = await Analytics.getSalesPerformanceDashboard(
            shopId,
            fromDate,
            toDate,
            granularity
        );

        return res.status(200).json({
            dashboard: dashboardData
        });
    } catch (error) {
        console.error("Error getting Sales Performance Dashboard: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const productInsightsDashboard = async (req, res) => {
    try {
        const shopId = await getUserShopId(req);
        const fromDate = decodeURIComponent(req.query.fromDate);
        const toDate = decodeURIComponent(req.query.toDate);

        const dashboardData = await Analytics.getProductInsightsDashboard(
            shopId,
            fromDate,
            toDate
        );
        return res.status(200).json({
            dashboard: dashboardData
        });
    } catch (error) {
        console.error("Error getting Product Insights Dashboard: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const productAnalytics = async (req, res) => {
    try {
        const shopId = await getUserShopId(req);
        const { productId } = req.params;
        const fromDate = decodeURIComponent(req.query.fromDate);
        const toDate = decodeURIComponent(req.query.toDate);
        const granularity = req.query.granularity;
        const isInsights = req.query.insights;

        const dashboardData = await Analytics.getOneProductAnalytics(
            shopId,
            fromDate,
            toDate,
            productId,
            granularity
        );

        if (isInsights) { 
            const insights = await Analytics.getProductAnalyticsInsights(dashboardData);

            return res.status(200).json({
                insights
            });
        }

        return res.status(200).json({
            dashboard: dashboardData
        });
    } catch (error) {
        console.error("Error getting Product Insights Dashboard: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}