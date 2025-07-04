import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { removeUndefined } from "../utils/cleanInputs.js";
import { fn, col, where, Op } from "sequelize";
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
    const limit = parseInt(req.query.limit) || 20;
    const  offset = (page - 1) * limit;

    try {

        const { shopId }  = req.params;
        const { category, minPrice, maxPrice, search } = req.query;
        const productQuery = { ShopId: shopId }

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
    const productBody = req.body.product;
    console.log(productBody)
    const { productId } = req.params;

    const productUpdate = {}

    if (productBody.name) { productUpdate.name = productBody.name }
    if (productBody.description) { productUpdate.description = productBody.description }
    if (productBody.category) { productUpdate.category = productBody.category }
    if (productBody.price) { productUpdate.price = productBody.price }
    if (productBody.stock) { productUpdate.stock = productBody.stock }

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

export const getShopOrders = async (req, res) => {
    try {
        const { sub } = req.auth.payload;
        
        const user = await User.findOne({ where: { auth0_uid: sub } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const shop = await Shop.findOne({ where: { UserId: user.id } });
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const orders = await Order.findAll({ where: { ShopId: shop.id } });

        if (!orders) { return res.status(404).json({ message: "No orders have been placed." }) };
        return res.status(200).json({ orders });

    } catch (error) {
        console.error("Error getting orders: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOneShopOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByPk(orderId, {
            include: {
                model: Product,
                attributes: ['id', 'name', 'category'],
                through: {
                    attributes: ['quantity', 'priceAtTime']
                }
            }
        });

        if (order) {
            res.status(200).json({ order });
        } else {
            res.status(404).json({ message: "Order not found" });
        }

    } catch (error) {
        console.error(`Error getting order ${ orderId }: `, error);
        res.status(500).json({ message: "Internal server error" })
    }
};

export const updateShopOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByPk(orderId);

        if (order) {
            await order.update({ status });

            res.status(200).json({ order });
        } else {
            res.status(404).json({ message: "Order not found" });
        }

    } catch (error) {
        console.error("Error updating order status: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}