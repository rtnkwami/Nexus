import User from '../models/User.js';

export const getUser = async (req, res) => {
    const { sub, name } = req.body;

    try {
        await User.findOrCreate({
            where: { auth0_uid: sub, name: name },
            defaults: { auth0_uid: sub, name: name}
        });

        res.status(200).json({ message: "User created or present" });
    } catch (error) {
        console.error(`Error getting or creating user: ${error}`);
    }
}