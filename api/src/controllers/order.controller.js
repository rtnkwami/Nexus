import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getAllOrders = async (req, res) => {
    try {
        const { sub } = req.auth.payload;
        const user = await User.findOne({ where: { auth0_uid: sub } });
        const orders = await Order.findAll({ where: { UserId: user.id } });

        if (!orders) { return res.status(404).json({ message: "No orders have been placed." }) };
        return res.status(200).json({ orders })

    } catch (error) {
        console.error("Error getting orders: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
;}

export const getOneOrder = async (req, res) => {
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