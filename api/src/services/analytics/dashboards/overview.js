import { fn, col, Op } from "sequelize";
import { getDateRange, getPreviousDateRange } from "../../../utils/getDateRange.js";
import { Order } from "../../../models/index.js";

export const getOverviewDashboard = async (shopId, period = 'monthly') => {
    const revenueOverview = await getTotalShopRevenue(shopId, period);
    const aovOverview = await getAverageOrderValue(shopId, period);

    return {
        revenueOverview,
        aovOverview
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


const getAverageOrderValue = async (shopId, period) => {
    try {
        const { startDate, endDate } = getDateRange(period);
        const { startDate: prevStart, endDate: prevEnd } = getPreviousDateRange(period);

        const [current, previous] = await Promise.all([
            Order.findOne({
                attributes: [
                    [fn('AVG', col('total')), 'avgOrderValue']
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
                    [fn('AVG', col('total')), 'avgOrderValue']
                ],
                where: {
                    ShopId: shopId,
                    createdAt: {
                        [Op.between]: [prevStart, prevEnd]
                    }
                }
            })
        ]);

        const currentAov = Math.round((current?.dataValues?.avgOrderValue ?? 0) * 100) / 100;
        const previousAov = previous?.dataValues?.avgOrderValue || 0;

        const percentageChange = previousAov > 0
            ? ((currentAov - previousAov) / previousAov) * 100
            : currentAov > 0 ? 100 : 0;

        return {
            avgOrderValue: currentAov,
            period,
            percentageChange: Math.round(percentageChange * 100) / 100,
            trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable'
        };
    } catch (error) {
        console.error('Error getting average order value:', error);
        return {
            avgOrderValue: 0,
            period,
            percentageChange: 0,
            trend: 'stable'
        };
    }
}