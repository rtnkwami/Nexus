import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import { removeUndefined } from "../utils/cleanInputs.js";
import { Op } from "sequelize";
import { getUserShopId } from "../utils/getUserShop.js";

export const updateShopMetadata =  async (req, res) => {
    const { name, description } = req.body.shop;
    const shopId = await getUserShopId(req);

    const shopUpdate = removeUndefined({ name, description });

    try {
        const shop = await Shop.findByPk(shopId);
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
};

export const createShopProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body.product;
    const shopId = await getUserShopId(req);

    try {
        const shop = await Shop.findByPk(shopId);

        if (shop) {
            const product = await Product.create({
                name: name,
                description: description,
                price: price,
                category: category,
                stock: stock,
                ShopId: shopId
            });

            if (product) {
                res.status(201).json({
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        category: category,
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

export const getShopProducts = async (req, res) => {    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const  offset = (page - 1) * limit;

    try {

        const shopId  = await getUserShopId(req);
        const { category, minPrice, maxPrice, search } = req.query;
        const productQuery = { ShopId: shopId }

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

export const getOneShopProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByPk(productId);

        if (product) { 
            res.status(200).json({ product });
        };
    } catch (error) {
        console.error(`Error getting product ${ id }: `, error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateShopProduct = async (req, res) => {
    const { name, description, category, price, stock } = req.body.product;
    const { productId } = req.params;

    const productUpdate = removeUndefined({ 
        name,
        description,
        category,
        price,
        stock
     });

    try {
        const product = await Product.findByPk(productId);

        if (product) {
            await product.update(productUpdate);

            res.status(201).json({ product });
        }

    } catch (error) {
        console.error("Error updating product: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteShopProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByPk(productId);

        if (product) {
            await product.destroy();
            res.status(200).json({ message: "Product deleted" });
        }
    } catch (error) {
        console.error("Error deleting product: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}