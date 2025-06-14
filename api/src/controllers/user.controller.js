import User from '../models/User.js';
import Shop from '../models/Shop.js';
import session from 'express-session';

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

export const getUserCart = async (req, res) => {
    if (!req.session.cart) { req.session.cart = [] };

    try {
        
    } catch (error) {
        
    }
}