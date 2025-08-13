import { fn, col, Op } from "sequelize";
import { getDateRange, getPreviousDateRange } from "../../../utils/getDateRange.js";
import { Order, sequelize } from "../../../models/index.js";

export const getOverviewDashboard = async (shopId, period = 'monthly') => {
    const revenueOverview = await getTotalShopRevenue(shopId, period);
    const aovOverview = await getAverageOrderValue(shopId, period);
    const topProductsOverview = await getTopProducts(shopId, period);
    const topProductsFrequency = await getTopProductsFrequency(shopId, period);
    const repeatPurchaseRate = await getRepeatPurchaseRate(shopId, period);

    return {
        revenueOverview,
        aovOverview,
        repeatPurchaseRate,
        topProductsOverview: {
            byPopularity: topProductsOverview.popularity,
            byAppearances: topProductsFrequency.frequency,
        },
        period,
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
                    status: 'completed',
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
                    status: 'completed',
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
            
        return {
            totalRevenue: currentRevenue,
            percentageChange: Math.round(percentageChange * 100) / 100,
            trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable'
        };
    } catch (error) {
        console.error('Error getting revenue comparison:', error);
        return {
            totalRevenue: 0,
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
                    status: 'completed',
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
                    status: 'completed',
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
            percentageChange: Math.round(percentageChange * 100) / 100,
            trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable'
        };
    } catch (error) {
        console.error('Error getting average order value:', error);
        return {
            avgOrderValue: 0,
            percentageChange: 0,
            trend: 'stable'
        };
    }
}


const getTopProducts = async (shopId, period) => {
    try {
        const { startDate, endDate } = getDateRange(period);

        const query = `
            SELECT 
                "Products".id,
                "Products".name,
                SUM("OrderItems".quantity) AS "totalSold"
            FROM "OrderItems"
            INNER JOIN "Orders" ON "OrderItems"."OrderId" = "Orders".id
            INNER JOIN "Products" ON "OrderItems"."ProductId" = "Products".id
            WHERE "Orders"."ShopId" = :shopId
              AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
              AND "Orders".status = 'completed'
            GROUP BY "Products".id
            ORDER BY "totalSold" DESC
            LIMIT 5;
        `;

        const topProducts = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                shopId,
                startDate,
                endDate
            }
        });

        return {
            popularity: topProducts,
        };

    } catch (error) {
        console.error('Error getting top products:', error);
        return {
            popularity: [],
        };
    }
};

const getTopProductsFrequency = async (shopId, period) => {
    try {
        const { startDate, endDate } = getDateRange(period);

        const query = `
            SELECT 
                "Products".id,
                "Products".name,
                SUM("OrderItems".quantity * "OrderItems"."priceAtTime") AS "totalRevenue",
                COUNT(DISTINCT "Orders".id) AS "appearances",
                COUNT(DISTINCT "Orders".id)::float / NULLIF(
                (SELECT COUNT(*) FROM "Orders" WHERE "ShopId" = :shopId AND "createdAt" BETWEEN :startDate AND :endDate), 0
                ) AS "orderFrequency"
            FROM "OrderItems"
            INNER JOIN "Orders" ON "OrderItems"."OrderId" = "Orders".id
            INNER JOIN "Products" ON "OrderItems"."ProductId" = "Products".id
            WHERE "Orders"."ShopId" = :shopId
                AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                AND "Orders".status = 'completed'
            GROUP BY "Products".id
            ORDER BY "totalRevenue" DESC
            LIMIT 5;
        `;

        const topProducts = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                shopId,
                startDate,
                endDate
            }
        });

        return {
            frequency: topProducts,
        };


    } catch (error) {
        console.error('Error getting top products:', error);
        return {
            frequency: [],
        };
    }
};

const getRepeatPurchaseRate = async (shopId, period) => {
    try {
        const { startDate, endDate } = getDateRange(period);
        const { startDate: prevStart, endDate: prevEnd } = getPreviousDateRange(period);

        const repeatPurchaseQuery = `
            SELECT
                COUNT(*)::float / NULLIF(
                (SELECT COUNT(DISTINCT "UserId")
                FROM "Orders"
                WHERE "ShopId" = :shopId
                    AND "createdAt" BETWEEN :startDate AND :endDate
                ), 0
                ) AS "repeatPurchaseRate"
            FROM (
                SELECT "UserId"
                FROM "Orders"
                WHERE "ShopId" = :shopId
                    AND "createdAt" BETWEEN :startDate AND :endDate
                    AND "status" = 'completed'
                GROUP BY "UserId"
                HAVING COUNT(*) > 1
            ) AS repeat_customers;
            `;

        const [currentResult, previousResult] = await Promise.all([
            sequelize.query(repeatPurchaseQuery, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate
                }
            }),
            sequelize.query(repeatPurchaseQuery, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate: prevStart,
                    endDate: prevEnd
                }
            })
        ]);

    const currentRate = (currentResult[0]?.repeatPurchaseRate || 0) * 100;
    const previousRate = (previousResult[0]?.repeatPurchaseRate || 0) * 100;

    const percentageChange = currentRate - previousRate;

    return {
        rate: Math.round(currentRate * 100) / 100,
        percentageChange: Math.round(percentageChange * 100) / 100,
        trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable',
    };

    } catch (error) {
        console.error('Error getting repeat purchase rate:', error);
        return {
            rate: 0,
            percentageChange: 0,
            trend: 'stable'
        };
    }
};