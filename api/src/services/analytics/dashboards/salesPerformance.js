import { fn, col, Op } from "sequelize";
import { getLineGraphDateRange } from "../../../utils/getDateRange.js";
import { Order, sequelize } from "../../../models/index.js";

export const getSalesPerformanceDashboard = async (shopId, fromDate, toDate, granularity) => {
    const historicalSales = await getSalesOverTime(shopId, fromDate, toDate, granularity);

    return {
        historicalSales,
        grouping: granularity,
    }
};

const getSalesOverTime = async (shopId, fromDate, toDate, granularity) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);
        console.log(startDate, endDate, granularity);

        if (granularity === 'daily') {
            const query = `
                SELECT 
                    DATE("Orders"."createdAt") AS period,
                    SUM("Orders".total) AS revenue
                FROM "Orders"
                WHERE "Orders"."ShopId" = :shopId
                    AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                GROUP BY DATE("Orders"."createdAt")
                ORDER BY period;
            `;

            const salesByDay = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate
                }
        });

            return salesByDay;

        } else if (granularity === 'weekly') {
            const query = `
                SELECT
                    date_trunc('week', "Orders"."createdAt")::date AS period,
                    SUM("Orders"."total") AS revenue
                FROM "Orders"
                WHERE "Orders"."ShopId" = :shopId
                    AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                GROUP BY date_trunc('week', "Orders"."createdAt")::date
                ORDER BY period;
            `;

            const salesByWeek = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate
                }
            });

            console.log("Sales by week: ", salesByWeek);
            return salesByWeek;

        } else if (granularity === 'monthly') {
            const query = `
                SELECT
                    date_trunc('month', "Orders"."createdAt")::date AS period,
                    SUM("Orders"."total") AS revenue
                FROM "Orders"
                WHERE "Orders"."ShopId" = :shopId
                    AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                GROUP BY date_trunc('month', "Orders"."createdAt")::date
                ORDER BY period;
            `;

            const salesByMonth = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate
                }
            });

            console.log("Sales by month: ", salesByMonth);
            return salesByMonth;
        };

    } catch (error) {
        console.error('Error getting sales over time:', error);
        return [];
    }

};


