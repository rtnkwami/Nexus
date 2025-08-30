import { sequelize } from "../../models/index.js";

export const getPopularProductsByCategory = async (category) => {
    const query = `
        WITH weekly_sales AS (
            SELECT 
                oi."ProductId",
                SUM(oi.quantity) as total_units_sold
            FROM "OrderItems" oi
            JOIN "Orders" o ON oi."OrderId" = o.id
            JOIN "Products" p ON oi."ProductId" = p.id
            WHERE o."createdAt" >= NOW() - INTERVAL '7 days'
                AND o.status = 'completed'
                AND p.category = :category
            GROUP BY oi."ProductId"
        ),
        ranked_products AS (
            SELECT 
                p.id,
                p.name,
                p.description,
                p.category,
                p.price,
                p.stock,
                p.images,
                p."ShopId",
                p."createdAt",
                p."updatedAt",
                ws.total_units_sold,
                ROW_NUMBER() OVER (ORDER BY ws.total_units_sold DESC) as rank
            FROM "Products" p
            JOIN weekly_sales ws ON p.id = ws."ProductId"
        )
        SELECT 
        id,
        name,
        description,
        category,
        price,
        images,
        rank
        FROM ranked_products
        WHERE rank <= 8
        ORDER BY category, rank;
    `;

    const popularProducts = await sequelize.query(query, {
        replacements: { category },
        type: sequelize.QueryTypes.SELECT
    });

    return popularProducts;
};