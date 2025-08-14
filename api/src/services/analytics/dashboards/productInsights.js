import { sequelize } from "../../../models/index.js";
import { getLineGraphDateRange } from "../../../utils/getDateRange.js";

export const getProductInsightsDashboard = async (shopId, fromDate, toDate) => {
    const conversionRankings = await getHighestConversionProducts(shopId, fromDate, toDate);

    return {
        conversionRankings
    }
};


const getHighestConversionProducts = async (shopId, fromDate, toDate, ranking = 'highest', limit = 5) => {
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
                GROUP BY p.id, p.name
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
                END as conversion_rate
            FROM product_views pv
            LEFT JOIN product_purchases pp ON pv.product_id = pp.product_id
            ORDER BY conversion_rate ${order}
            LIMIT ${limit};
        `;
        
        const conversionRankings = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    shopId,
                    startDate,
                    endDate
                }
        });

        console.log("Conversion Rankings: ", conversionRankings);
        return conversionRankings

    } catch (error) {
        console.error("Error fetching highest conversion products:", error);
        return [];
    }
}