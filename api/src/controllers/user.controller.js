import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import { sequelize } from '../models/index.js';
import session from 'express-session';
import Order from '../models/Order.js';

export const getUserMetadata = async (req, res) => {
    const { sub, name } = req.body.user;

    try {
        await User.findOrCreate({
            where: { auth0_uid: sub, name: name },
            defaults: { auth0_uid: sub, name: name}
        });

        const user = await User.findOne({ where: { auth0_uid: sub } });
        await Shop.findOrCreate({
            where: { UserId: user.id },
            defaults: { name: `${user.name}'s Shop` }
        });

        const shop = await Shop.findOne({ where: { UserId: user.id } })
        res.status(200).json(
            {
                user: { 
                    id: user.id,
                    username: user.name
                },
                userShop: { 
                    id: shop.id,
                    name: shop.name,
                    description: shop.description
                }
            }
        );
    } catch (error) {
        console.error(`Error getting or creating user: ${error}`);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getUserOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const whereClause = {};

    try {
        const { sub } = req.auth.payload;
        const user = await User.findOne({where: { auth0_uid: sub } });
        if (!user) { return res.status(404).json({ message: "User not found" }) };
        
        const { status } = req.query;
        
        if (status) {
            whereClause.status = status;
        }

        const count = await user.countOrders({ where: whereClause });
        if (count === 0) {
            return res.status(404).json({
                message: "No orders have been placed."
            })
        };
        
        const orders = await user.getOrders({
            where: whereClause,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        if (!orders) {
            return res.status(404).json({
                message: "No orders have been placed."
            })
        };
        
        const totalPages = Math.ceil(count / limit);
        return res.status(200).json({
        orders,
        pagination: {
            currentPage: page,
            totalPages,
            totalOrders: count,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        });

    } catch (error) {
        console.error("Error getting orders: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOneUserOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId);
        if (!order){ return res.status(404).json({ message: "Order doesn't exist" }) }

        const orderProducts = await order.getProducts({
            attributes: ['id', 'name', 'category'],
            through: {
                attributes: ['quantity', 'priceAtTime']
            }
        });

        const cleanProducts = orderProducts.map(product => {
            return {
                id: product.id,
                name: product.name,
                category: product.category,
                quantity: product.OrderItem.quantity,
                priceAtTime: product.OrderItem.priceAtTime
            };
        });

        return res.status(200).json({ order, products: cleanProducts });
        
    } catch (error) {
        console.error("Error getting orders: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const placeOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try { 
        const { sub } = req.auth.payload;
        const cart = req.session.cart || [];
    
        if (cart.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: "Cart cannot be empty" })
        };
    
        const user = await User.findOne({
            where: { auth0_uid: sub },
            transaction 
        });

        const cartProductIds = cart.map(item => item.id);
        const products = await Product.findAll({
            where: { id: cartProductIds },
            transaction
        });

        const shopGroups = {};
        for (const item of cart) {
            const product = products.find(p => p.id === item.id);
            const shopId = product.ShopId;
            
            if (!shopGroups[shopId]) {
                shopGroups[shopId] = [];
            }
            shopGroups[shopId].push({ product, quantity: item.quantity });
        }

        const createdOrders = [];

        for (const shopId of Object.keys(shopGroups)) {
            const order = await Order.create({
                UserId: user.id,
                ShopId: shopId
            }, { transaction });

            const shopItems = shopGroups[shopId];

            for (const { product, quantity } of shopItems) {
                if (product.stock < quantity) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
                }

                await order.addProduct(product, {
                    through: {
                        quantity: quantity,
                        priceAtTime: product.price
                    },
                    transaction
                });

                const total = Math.round((quantity * product.price) * 100) / 100;
                await order.update({ total: order.total + total }, { transaction });

                await product.decrement('stock', {
                    by: quantity,
                    transaction
                });
            }

            createdOrders.push(order.id);
        }

        await transaction.commit();
        req.session.cart = [];
    
        return res.status(201).json({
            success: true,
            orders: createdOrders,
            message: 'Order created successfully'
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        console.error("Error creating order: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}