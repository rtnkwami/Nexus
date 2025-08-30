import { Product } from "../models/index.js";
import { fn, col, Op } from "sequelize";
import { getPopularProductsByCategory } from "../services/products/popularProducts.js";

export const getAllProducts = async (req, res) => {    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const  offset = (page - 1) * limit;

    try {
        const { category, minPrice, maxPrice, search } = req.query;
        const productQuery = { }

        const min = Number(minPrice);
        const max = Number(maxPrice);

        if (category) { productQuery.category = category }
        if (minPrice || maxPrice) {
            productQuery.price = {};
            if (minPrice) { productQuery.price[Op.gte] = min }
            if (maxPrice) { productQuery.price[Op.lte] = max }
        }


        const whereClause = { ...productQuery };

        if (search) {
            whereClause.name = {
                [Op.iLike]: `%${search}%`,
            };
        }


        const { count, rows } = await Product.findAndCountAll({ 
            where: whereClause,
            offset,
            limit,
            order: [['updatedAt', 'DESC']]
        });

        res.status(200).json({
            products: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalProducts: count,
                hasNextPage: page < Math.ceil(count / limit),
                hasPreviousPage: page > 1
            }
        })

    } catch (error) {
        console.error("Error getting shop products: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOneProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.createProductView();

        res.status(200).json({ product });
    } catch (error) {
        console.error("Error getting product: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json({ categories: categories.map(cat => cat.get('category')) });

  } catch (error) {
    console.error("Error getting product categories: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchSuggestions = async (req, res) => {
    try {
        const q = req.query.q?.toString().toLowerCase() || "";
        if (!q) return res.json([]);
        console.log(q);
        const matches = await Product.findAll({
                where: {
                    name: { [Op.iLike]: `%${q}%` },
                },
                attributes: ["id", "name"],
                limit: 5,
                raw: true
            });

        res.json(matches);
        
    } catch (error) {
        console.log('Error getting search suggestions', error)
        return res.status(500);
    }
}

export const getPopularProducts = async (req, res) => {
    try {
        const category = req.params.category;

        const popularProducts = await getPopularProductsByCategory(category);
        res.status(200).json({ popularProducts });
    } catch (error) {
        console.error("Error getting popular products: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}