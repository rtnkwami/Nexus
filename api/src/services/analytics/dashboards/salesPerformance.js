import { getLineGraphDateRange } from "../../../utils/getDateRange.js";
import { sequelize } from "../../../models/index.js";

export const getSalesPerformanceDashboard = async (shopId, fromDate, toDate, granularity) => {
    const historicalSales = await getSalesOverTime(shopId, fromDate, toDate, granularity);

    return {
        historicalSales,
        grouping: granularity,
    }
};

function fillMissingDates(rawData, startDate, endDate, valueField, granularity) {
    // Create a Map of your existing data for efficient lookups.
    const dataMap = new Map(
        rawData.map(row => [row.period, parseFloat(row[valueField])])
    );

    const filledData = [];
    let current = new Date(startDate); // Use 'let' as this date will be modified
    const end = new Date(endDate);

    // ## ALIGNMENT FIX ##
    // Adjust the start date to match the behavior of SQL's `date_trunc`.
    if (granularity === 'weekly') {
        // PostgreSQL's week starts on Monday. JS getDay() is Sunday=0, Monday=1...
        const dayOfWeek = current.getDay();
        // Calculate the number of days to subtract to get to the preceding Monday.
        const offset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; 
        current.setDate(current.getDate() - offset);
    } else if (granularity === 'monthly') {
        // Align the date to the first day of the month.
        current.setDate(1);
    }

    while (current <= end) {
        const period = current.toISOString().split('T')[0];

        // This check prevents adding data points from *before* the user's requested
        // startDate, which can happen after we align the date backwards.
        if (new Date(period) >= new Date(startDate)) {
            filledData.push({
                period: period,
                [valueField]: dataMap.get(period) || 0,
            });
        }

        // Increment to the next period using the correct interval
        switch (granularity) {
            case 'weekly':
                current.setDate(current.getDate() + 7);
                break;
            case 'monthly':
                current.setMonth(current.getMonth() + 1);
                break;
            default: // 'daily'
                current.setDate(current.getDate() + 1);
                break;
        }
    }
    return filledData;
}

const getSalesOverTime = async (shopId, fromDate, toDate, granularity) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);

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

            const filledSalesData = fillMissingDates(salesByDay, startDate, endDate, 'revenue', 'daily');
            return filledSalesData;

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
            const filledSalesData = fillMissingDates(salesByWeek, startDate, endDate, 'revenue', 'weekly');
            return filledSalesData;

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

            const filledSalesData = fillMissingDates(salesByMonth, startDate, endDate, 'revenue', 'monthly');
            return filledSalesData;
        };

    } catch (error) {
        console.error('Error getting sales over time:', error);
        return [];
    }

};