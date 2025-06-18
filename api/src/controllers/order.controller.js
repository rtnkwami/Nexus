import Order from "../models/Order.js";
import User from "../models/User.js";

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
}