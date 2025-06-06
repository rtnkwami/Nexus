import Product from "../models/Product.js";
import Shop  from "../models/Shop.js";

export const createProduct = async (req, res) => {
    const { shopId, name, description, price, stock } = req.body.product;

    try {
        const shop = await Shop.findByPk(shopId);

        if (shop) {
            const product = await Product.create({
                name: name,
                description: description,
                price: price,
                stock: stock,
                ShopId: shopId
            });

            if (product) {
                res.status(201).json({
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock
                    }
                });
            }
        } else {
            return res.status(400).json({ message: "Shop doesn't exist" })
        }
    } catch(error) {
        console.error("Error creating product: ", error);
        return res.status(500).json({ message: "Internal server error" })
    }
};