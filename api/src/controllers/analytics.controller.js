import { getUserShopId } from "../utils/getUserShop.js"
import { Analytics } from "../services/analytics.service.js";

export const overviewDashboard = async (req, res) => {
    try {
        const shopId = await getUserShopId(req);
        const period = req.query.period;

        const dashboardData = await Analytics.getOverviewDashboard(shopId, period);
        console.log("Dashboard Data: ", dashboardData);

        return res.status(200).json({
            dashboard: dashboardData
        });

    } catch (error) {
        console.error("Error getting Overview Dashboard: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}