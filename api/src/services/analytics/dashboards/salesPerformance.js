import { getLineGraphDateRange } from "../../../utils/getDateRange.js";
import { sequelize } from "../../../models/index.js";

export const getSalesPerformanceDashboard = async (shopId, fromDate, toDate, granularity) => {
    const historicalSales = await getSalesOverTime(shopId, fromDate, toDate, granularity);
    const topCategories = await getHistoricTopCategories(shopId, fromDate, toDate, granularity);

    return {
        historicalSales,
        topCategories,
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

function processCategoryData(rawData, topCategories, startDate, endDate, granularity) {
    // 1. Create a map for quick lookups, e.g., { '2025-07-16': { Electronics: 500, Books: 250 } }
    const rawDataMap = new Map();
    for (const row of rawData) {
        if (!rawDataMap.has(row.period)) {
            rawDataMap.set(row.period, {});
        }
        rawDataMap.get(row.period)[row.category] = parseFloat(row.category_revenue);
    }

    // 2. Generate the complete, correctly aligned date range and fill in the data.
    const datapoints = [];
    let current = new Date(startDate);
    const end = new Date(endDate);

    // Align the start date to match SQL's date_trunc behavior
    if (granularity === 'weekly') {
        const dayOfWeek = current.getDay();
        const offset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
        current.setDate(current.getDate() - offset);
    } else if (granularity === 'monthly') {
        current.setDate(1);
    }

    while (current <= end) {
        const period = current.toISOString().split('T')[0];

        // Only add data points within the user's selected range
        if (new Date(period) >= new Date(startDate)) {
            const dailyData = { period };
            const dataForPeriod = rawDataMap.get(period) || {};

            // Ensure every top category has a value (even if 0) for this period
            for (const category of topCategories) {
                dailyData[category] = dataForPeriod[category] || 0;
            }
            datapoints.push(dailyData);
        }
        
        // Increment to the next period
        switch (granularity) {
            case 'weekly':
                current.setDate(current.getDate() + 7);
                break;
            case 'monthly':
                current.setMonth(current.getMonth() + 1);
                break;
            default:
                current.setDate(current.getDate() + 1);
                break;
        }
    }

    return { datapoints, categories: topCategories };
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


const getHistoricTopCategories = async (shopId, fromDate, toDate, granularity) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);

        // === STEP 1: Find the top 5 categories for the entire period ===
        const topCategoriesQuery = `
            SELECT "Products"."category"
            FROM "OrderItems"
            JOIN "Orders" ON "OrderItems"."OrderId" = "Orders"."id"
            JOIN "Products" ON "OrderItems"."ProductId" = "Products"."id"
            WHERE "Orders"."ShopId" = :shopId
                AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
            GROUP BY "Products"."category"
            ORDER BY SUM("OrderItems"."quantity" * "OrderItems"."priceAtTime") DESC
            LIMIT 5;
        `;
        const topCategoriesResult = await sequelize.query(topCategoriesQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { shopId, startDate, endDate }
        });

        // If there are no categories, return an empty state.
        if (topCategoriesResult.length === 0) {
            return { datapoints: [], categories: [] };
        }
        
        const topCategories = topCategoriesResult.map(c => c.category);

        // === STEP 2: Get revenue over time for ONLY those top categories ===
        let dateTrunc;
        switch (granularity) {
            case 'weekly':
                dateTrunc = `date_trunc('week', "Orders"."createdAt")::date`;
                break;
            case 'monthly':
                dateTrunc = `date_trunc('month', "Orders"."createdAt")::date`;
                break;
            default: // daily
                dateTrunc = `DATE("Orders"."createdAt")`;
                break;
        }

        const query = `
            SELECT
                ${dateTrunc} AS period,
                "Products"."category" AS category,
                SUM("OrderItems"."quantity" * "OrderItems"."priceAtTime") AS category_revenue
            FROM "OrderItems"
            JOIN "Orders" ON "OrderItems"."OrderId" = "Orders"."id"
            JOIN "Products" ON "OrderItems"."ProductId" = "Products"."id"
            WHERE "Orders"."ShopId" = :shopId
                AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                AND "Products"."category" IN (:topCategories)
            GROUP BY period, "Products"."category"
            ORDER BY period;
        `;

        const categoriesOverTime = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { shopId, startDate, endDate, topCategories }
        });

        // === STEP 3: Process the data into the final chart-ready format ===
        return processCategoryData(categoriesOverTime, topCategories, startDate, endDate, granularity);

    } catch (error) {
        console.error('Error getting top categories:', error);
        return { datapoints: [], categories: [] };
    }
};