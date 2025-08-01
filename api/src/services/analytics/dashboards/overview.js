import { fn, col, Op } from "sequelize";
import { getDateRange, getPreviousDateRange } from "../../../utils/getDateRange.js";
import { Order } from "../../../models/index.js";

export const getOverviewDashboard = async (shopId, period = 'monthly') => {
    const revenueOverview = await getTotalShopRevenue(shopId, period);

    return {
        revenueOverview
    }
};


const getTotalShopRevenue = async (shopId, period) => {
    try {
        const { startDate, endDate } = getDateRange(period);
        const { startDate: prevStart, endDate: prevEnd } = getPreviousDateRange(period);
        
        const [current, previous] = await Promise.all([
            Order.findOne({
                attributes: [
                    [fn('SUM', col('total')), 'totalRevenue']
                ],
                where: {
                    ShopId: shopId,
                    createdAt: { 
                        [Op.between]: [startDate, endDate]
                    }
                }
            }),
            Order.findOne({
                attributes: [
                    [fn('SUM', col('total')), 'totalRevenue']
                ],
                where: {
                    ShopId: shopId,
                    createdAt: {
                        [Op.between]: [prevStart, prevEnd]
                    }
                }
            })
        ]);
        
        const currentRevenue = current?.dataValues?.totalRevenue || 0;
        const previousRevenue = previous?.dataValues?.totalRevenue || 0;
        
        const percentageChange = previousRevenue > 0 
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
            : currentRevenue > 0 ? 100 : 0

            console.log("Current Revenue: ", currentRevenue);
            console.log("Previous Revenue: ", previousRevenue);
            
        return {
            totalRevenue: currentRevenue,
            period,
            percentageChange: Math.round(percentageChange * 100) / 100,
            trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable'
        };
    } catch (error) {
        console.error('Error getting revenue comparison:', error);
        return {
            totalRevenue: 0,
            period,
            percentageChange: 0,
            trend: 'stable'
        };
    }
}