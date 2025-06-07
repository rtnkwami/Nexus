import Shop from "../models/Shop.js";
import { removeUndefined } from "../utils/cleanInputs.js";

export const updateShopMetadata =  async (req, res) => {
    const { name, description } = req.body.shop;
    const { id } = req.params;

    const shopUpdate = removeUndefined({ name, description });

    try {
        const shop = await Shop.findByPk(id);
        await shop.update(shopUpdate);

        res.status(201).json(
            {
                userShop: {
                    id: shop.id,
                    name: shop.name,
                    description: shop.description
                }
            }
        );
        console.log(shop);

    } catch (error) {
        console.error('Error creating shop: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createShopProduct = async (req, res) => {
    const { name, description, price, stock } = req.body.product;
    const { id } = req.params;

    try {
        const shop = await Shop.findByPk(id);

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

export const updateShopProduct = async (req, res) => {
    const { name, description, price, stock } = req.body.product;
    const { id } = req.params;

    const productUpdate = removeUndefined({ 
        name,
        description,
        price,
        stock
     });

    try {
        const product = await Product.findByPk(id);

        if (product) {
            await product.update(productUpdate);

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

    } catch (error) {
        console.error("Error updating product: ", error);
        return res.status(500).json({ message: "Internal server error" })
    }
};