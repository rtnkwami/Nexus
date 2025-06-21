import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import session from 'express-session';
import Order from '../models/Order.js';

export const getUserMetadata = async (req, res) => {
    const { sub, name } = req.body.user;
    console.log(req.headers);

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
    try {
        const { sub } = req.auth.payload;
        const user = await User.findOne({ where: { auth0_uid: sub } });
        const orders = await Order.findAll({ where: { UserId: user.id } });

        if (!orders) { return res.status(404).json({ message: "No orders have been placed." }) };
        return res.status(200).json({ orders });

    } catch (error) {
        console.error("Error getting orders: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOneUserOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId, {
            include: {
                model: Product,
                attributes: ['id', 'name', 'category'],
                through: {
                    attributes: ['quantity', 'priceAtTime']
                }
            }
        });

        if (!order){ return res.status(404).json({ message: "Order doesn't exist" }) }

        return res.status(200).json({ order });
        

    } catch (error) {
        console.error("Error getting orders: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const placeOrder = async (req, res) => {
    try { 
        const { sub } = req.auth.payload;
        const cart = req.session.cart || [];
    
        if (cart.length === 0) { return res.status(400).json({ message: "Cart cannot be empty" }) };
    
        const user = await User.findOne({ where: { auth0_uid: sub } });
        const shop = await Shop.findOne({ where: { UserId: user.id } });
        const order = await Order.create({ UserId: user.id, ShopId: shop.id });
    
        for (const item of cart) { 
            const product = await Product.findByPk(item.id);

            await order.addProduct(product, {
                through: {
                    quantity: item.quantity,
                    priceAtTime: product.price
                }
            })
        }

        req.session.cart = [];
    
        return res.status(201).json({
            success: true,
            orderId: order.id,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error("Error creating order: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}