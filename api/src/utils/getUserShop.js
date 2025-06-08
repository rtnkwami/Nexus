import User from "../models/User.js";
import Shop from "../models/Shop.js";

export const getUserShopId = async (req) => {
    const { sub } = req.auth.payload;

    try {
        const user = await User.findOne({ where: { auth0_uid: sub } });
        if (!user) {
            throw new Error("User not found");
        }

        const shop = await Shop.findOne({ where: { UserId: user.id } });
        if (!shop) {
            throw new Error("Shop not found for user");
        }

        return shop.id;

    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
}