import User from '../models/User.js';
import Shop from '../models/Shop.js';

export const getUser = async (req, res) => {
    const { sub, name } = req.body;

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

        res.status(200).json({ message: "User created or present" });
    } catch (error) {
        console.error(`Error getting or creating user: ${error}`);
    }
}