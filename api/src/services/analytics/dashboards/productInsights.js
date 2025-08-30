import { sequelize } from "../../../models/index.js";
import { fn } from "sequelize";
import { getLineGraphDateRange } from "../../../utils/getDateRange.js";

import { fillMissingDates } from "./salesPerformance.js";

export function fillMissingOrders(rawData, startDate, endDate, valueFields, granularity) {
    // Create a Map where the key is the period and the value is the whole data object.
    const dataMap = new Map(
        rawData.map(row => {
            const values = {};
            // Make sure all values are parsed as floats
            valueFields.forEach(field => {
                values[field] = parseFloat(row[field] || 0);
            });
            return [row.period, values];
        })
    );

    const filledData = [];
    let current = new Date(startDate);
    const end = new Date(endDate);

    // ## ALIGNMENT FIX ## (This logic remains the same)
    if (granularity === 'weekly') {
        const dayOfWeek = current.getDay();
        const offset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; 
        current.setDate(current.getDate() - offset);
    } else if (granularity === 'monthly') {
        current.setDate(1);
    }

    while (current <= end) {
        const period = current.toISOString().split('T')[0];

        if (new Date(period) >= new Date(startDate)) {
            const existingData = dataMap.get(period);
            const dataPoint = { period };

            // For each field, use existing data or default to 0.
            valueFields.forEach(field => {
                dataPoint[field] = existingData ? existingData[field] : 0;
            });
            
            filledData.push(dataPoint);
        }

        // Increment to the next period (This logic remains the same)
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

export const getProductInsightsDashboard = async (shopId, fromDate, toDate) => {
    const highestConversionProduct = await getHighestConversionProducts(
        shopId,
        fromDate,
        toDate,
        'conversion_rate',
        'highest',
        1
    );
    
    const biggestOpportunity = await getHighestConversionProducts(
        shopId,
        fromDate,
        toDate,
        'missed_opportunity',
        'highest',
        1
    );

    const mostViewedProduct = await getMostViewedProducts(shopId, fromDate, toDate, 'highest', 1);
    const leastViewedProduct =  await getMostViewedProducts(shopId, fromDate, toDate, 'lowest', 1);

    return {
        highestConversionProduct: highestConversionProduct[0],
        mostViewedProduct: mostViewedProduct[0],
        leastViewedProduct: leastViewedProduct[0],
        biggestOpportunity: biggestOpportunity[0]
    }
};

export const getOneProductAnalytics = async (shopId, fromDate, toDate, productId, granularity) => {
    const revenue = await getProductRevenue(shopId, fromDate, toDate, productId);
    const unitSales = await getProductUnitSales(shopId, fromDate, toDate, productId);
    const orders = await getProductOrdersCount(shopId, fromDate, toDate, productId);
    const conversionRate = await getProductConversionRate(shopId, fromDate, toDate, productId);
    const salesHistory = await getProductSalesOverTime(shopId, fromDate, toDate, productId, granularity);

    return {
        revenue: revenue.total_revenue,
        unitsSold: unitSales.units_sold,
        orders: orders.orders,
        conversion: conversionRate.conversion_rate,
        salesHistory
    }
}


const getHighestConversionProducts = async (
    shopId,
    fromDate,
    toDate,
    sortBy,
    ranking = 'highest',
    limit = 5
) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);
        const order =
            ranking?.toLowerCase() === 'highest'
                ? 'DESC'
                : ranking?.toLowerCase() === 'lowest'
                ? 'ASC'
                : 'DESC';

        const query = `
            WITH product_views AS (
                SELECT 
                    p.id as product_id,
                    p.name as product_name,
                    p.category as product_category,
                    COUNT(pv.id) as view_count
                FROM "Products" p
                INNER JOIN "ProductViews" pv ON p.id = pv."ProductId"
                WHERE p."ShopId" = :shopId
                    AND pv."viewedAt" BETWEEN :startDate AND :endDate
                GROUP BY p.id, p.name, p.category
            ),
            product_purchases AS (
                SELECT 
                    p.id as product_id,
                    p.name as product_name,
                    COUNT(DISTINCT o.id) as purchase_count
                FROM "Products" p
                INNER JOIN "OrderItems" oi ON p.id = oi."ProductId"
                INNER JOIN "Orders" o ON oi."OrderId" = o.id
                WHERE p."ShopId" = :shopId
                    AND o."createdAt" BETWEEN :startDate AND :endDate
                GROUP BY p.id, p.name
            )
            SELECT 
                pv.product_id,
                pv.product_name,
                pv.product_category,
                pv.view_count,
                COALESCE(pp.purchase_count, 0) as purchase_count,
                CASE 
                    WHEN pv.view_count > 0 THEN 
                        ROUND((COALESCE(pp.purchase_count, 0)::DECIMAL / pv.view_count::DECIMAL) * 100, 2)
                    ELSE 0 
                END as conversion_rate,
                -- Missed Opportunity: simple missed sales count
                (pv.view_count - COALESCE(pp.purchase_count, 0)) as missed_opportunity
            FROM product_views pv
            LEFT JOIN product_purchases pp ON pv.product_id = pp.product_id
            ORDER BY 
                CASE 
                    WHEN :sortBy = 'conversion_rate' THEN 
                        CASE 
                            WHEN pv.view_count > 0 THEN 
                                ROUND((COALESCE(pp.purchase_count, 0)::DECIMAL / pv.view_count::DECIMAL) * 100, 2)
                            ELSE 0 
                        END
                    WHEN :sortBy = 'missed_opportunity' THEN 
                        (pv.view_count - COALESCE(pp.purchase_count, 0))
                    ELSE 
                        CASE 
                            WHEN pv.view_count > 0 THEN 
                                ROUND((COALESCE(pp.purchase_count, 0)::DECIMAL / pv.view_count::DECIMAL) * 100, 2)
                            ELSE 0 
                        END
                END ${order}
            LIMIT ${limit};
        `;
        
        const conversionRankings = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    sortBy
                }
        });

        return conversionRankings

    } catch (error) {
        console.error("Error fetching highest conversion products:", error);
        return [];
    }
}


const getMostViewedProducts = async (shopId, fromDate, toDate, ranking = 'highest', limit = 5) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);

        const order =
            ranking?.toLowerCase() === 'highest'
                ? 'DESC'
                : ranking?.toLowerCase() === 'lowest'
                ? 'ASC'
                : 'DESC';

        const query  = `
            SELECT 
                p.id as product_id,
                p.name as product_name,
                p.category as product_category,
                COUNT(pv.id) as view_count
            FROM "Products" p
            INNER JOIN "ProductViews" pv ON p.id = pv."ProductId"
            WHERE p."ShopId" = :shopId
                AND pv."viewedAt" BETWEEN :startDate AND :endDate
            GROUP BY p.id, p.name
            ORDER BY view_count ${ order }
            LIMIT ${ limit };
        `;

        const mostViewedProducts = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate
                }
        });

        return mostViewedProducts;

    } catch (error) {
        console.error("Error fetching most viewed products:", error);
        return [];
    }
}


const getProductRevenue = async (shopId, fromDate, toDate, productId) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);
    
        const query =  `
            SELECT 
                COALESCE(SUM(oi.quantity * oi."priceAtTime"), 0) AS total_revenue
            FROM "OrderItems" oi
            JOIN "Orders" o 
                ON oi."OrderId" = o.id
            JOIN "Products" p
                ON oi."ProductId" = p.id
            WHERE p.id = :productId
            AND p."ShopId" = :shopId
            AND o.status = 'completed'
            AND o."createdAt" BETWEEN :startDate AND :endDate;
        `;

        const revenue = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    productId
                }
        });
        return revenue[0];
        
    } catch (error) {
        console.error(`Error fetching ${productId} revenue`, error);
        return 0;
    }
}

const getProductUnitSales = async (shopId, fromDate, toDate, productId) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);

        const query = `
            SELECT 
                COALESCE(SUM(oi.quantity), 0) AS units_sold
            FROM "OrderItems" oi
            JOIN "Orders" o 
                ON oi."OrderId" = o.id
            JOIN "Products" p
                ON oi."ProductId" = p.id
            WHERE p.id = :productId
                AND p."ShopId" = :shopId
                AND o.status = 'completed'
                AND o."createdAt" BETWEEN :startDate AND :endDate;
        `;
        
        const unitSales = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    productId
                }
        });

        return unitSales[0];

    } catch (error) {
        console.error(`Error fetching ${productId} units sold`, error);
        return 0;
    }
}

const getProductOrdersCount = async (shopId, fromDate, toDate, productId) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);

        const query = `
            SELECT 
                COUNT(DISTINCT o.id) as orders
            FROM "OrderItems" oi
            JOIN "Orders" o 
                ON oi."OrderId" = o.id
            JOIN "Products" p
                ON oi."ProductId" = p.id
            WHERE p.id = :productId
                AND p."ShopId" = :shopId
                AND o.status = 'completed'
                AND o."createdAt" BETWEEN :startDate AND :endDate;
        `;

        const orders = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    productId
                }
        });

        return orders[0];

    } catch (error) {
        console.error(`Error fetching ${productId} order appearances`, error);
        return 0;
    }
}

const getProductConversionRate = async (shopId, fromDate, toDate, productId) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);

        const query = `
            WITH product_views AS (
                SELECT 
                    p.id as product_id,
                    p.name as product_name,
                    p.category as product_category,
                    COUNT(pv.id) as view_count
                FROM "Products" p
                INNER JOIN "ProductViews" pv ON p.id = pv."ProductId"
                WHERE p."ShopId" = :shopId
                    AND p.id = :productId
                    AND pv."viewedAt" BETWEEN :startDate AND :endDate
                GROUP BY p.id, p.name, p.category
            ),
            product_purchases AS (
                SELECT 
                    p.id as product_id,
                    p.name as product_name,
                    COUNT(DISTINCT o.id) as purchase_count
                FROM "Products" p
                INNER JOIN "OrderItems" oi ON p.id = oi."ProductId"
                INNER JOIN "Orders" o ON oi."OrderId" = o.id
                WHERE p."ShopId" = :shopId
                    AND p.id = :productId
                    AND o."createdAt" BETWEEN :startDate AND :endDate
                GROUP BY p.id, p.name
            )
            SELECT 
                pv.product_id,
                pv.product_name,
                pv.product_category,
                pv.view_count,
                COALESCE(pp.purchase_count, 0) as purchase_count,
                CASE 
                    WHEN pv.view_count > 0 THEN 
                        ROUND((COALESCE(pp.purchase_count, 0)::DECIMAL / pv.view_count::DECIMAL) * 100, 2)
                    ELSE 0 
                END as conversion_rate
            FROM product_views pv
            LEFT JOIN product_purchases pp ON pv.product_id = pp.product_id;
        `;
        
        const conversionRate = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    productId
                }
        });
        console.log(conversionRate);
        return conversionRate[0];

    } catch (error) {
        console.error(`Error fetching ${productId} order appearances`, error);
        return 0;
    }   
}


const getProductSalesOverTime = async (shopId, fromDate, toDate, productId, granularity) => {
    try {
        const { startDate, endDate } = getLineGraphDateRange(fromDate, toDate);
        
        let dateTrunc;
        switch (granularity) {
            case 'weekly':
                dateTrunc = `date_trunc('week', "Orders"."createdAt")::date`;
                break;
            case 'monthly':
                dateTrunc = `date_trunc('month', "Orders"."createdAt")::date`;
                break;
            default:
                dateTrunc = `DATE("Orders"."createdAt")`;
                break;
        }

        const historicalRevenueQuery = `
            SELECT
                ${dateTrunc} AS period,
                SUM("OrderItems"."quantity" * "OrderItems"."priceAtTime") AS revenue
            FROM "OrderItems"
            JOIN "Orders" ON "OrderItems"."OrderId" = "Orders"."id"
            JOIN "Products" ON "OrderItems"."ProductId" = "Products"."id"
            WHERE "Orders"."ShopId" = :shopId
                AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                AND "Orders".status = 'completed'
                AND "Products"."id" = :productId
            GROUP BY ${dateTrunc}
            ORDER BY period;
        `;

        const historicalOrdersQuery = `
            SELECT
                ${dateTrunc} AS period,
                SUM("OrderItems"."quantity") AS units_sold,
                COUNT(DISTINCT "Orders"."id") AS orders
            FROM "OrderItems"
            JOIN "Orders" ON "OrderItems"."OrderId" = "Orders"."id"
            JOIN "Products" ON "OrderItems"."ProductId" = "Products"."id"
            WHERE "Orders"."ShopId" = :shopId
                AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
                AND "Orders".status = 'completed'
                AND "Products"."id" = :productId
            GROUP BY ${dateTrunc}
            ORDER BY period;
        `;

        const [rawHistoricalRevenue, rawHistoricalOrders] = await Promise.all([
            sequelize.query(historicalRevenueQuery, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    productId
                }
            }),

            sequelize.query(historicalOrdersQuery, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate,
                    productId
                }
            })
        ]);

        const historicalRevenue = fillMissingDates(
            rawHistoricalRevenue,
            startDate,
            endDate,
            'revenue',
            granularity
        );

        const historicalOrders = fillMissingOrders(
            rawHistoricalOrders,
            startDate,
            endDate,
            ['units_sold', 'orders'],
            granularity
        );

        return {
            historicalRevenue,
            historicalOrders
        }

    } catch (error) {
        console.error('Error fetching product sales over time:', error);
        return [];
    }
}