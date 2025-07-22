import { getTotalShopRevenue } from "../services/analytics.service.js"
import { getDateRange } from "../utils/getDateRange.js";
import { getUserShopId } from "../utils/getUserShop.js"

export const getTotalRevenue = async (req, res) => {
    try {
        const shopId = await getUserShopId(req);
        const { period = 'monthly' } = req.query        
        const totalRevenue = await getTotalShopRevenue(shopId, period);

        if (!shopId) { return res.status(404).json({ error: "Shop not found." }) };

        return res.json({
            shopId,
            period,
            totalRevenue
        });
        
    } catch (error) {
        console.error("Error getting shop revenue: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
    

    

}