import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const  offset = (page - 1) * limit;

    try {
        const { category, minPrice, maxPrice, search } = req.query;
        const productQuery = { }

        const min = Number(minPrice);
        const max = Number(maxPrice);

        if (category) { productQuery.category = category }
        if (minPrice && maxPrice) { productQuery.price = { [Op.between]: [min, max] } }
        if (search) { productQuery.name = { [Op.like]: `%${ search }%` } }

        const { count, rows } = await Product.findAndCountAll({ 
            where: productQuery,
            offset,
            limit
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

        res.status(200).json({ product });
    } catch (error) {
        console.error("Error getting product: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}