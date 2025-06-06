import Shop from "../models/Shop.js";
import User from "../models/User.js";

export const updateShopMetadata =  async (req, res) => {
    const { shopId, shopName, shopDescription } = req.body;

    try {
        const shop = await Shop.findByPk(shopId);
        await shop.update(
            {
                name: shopName,
                description: shopDescription
            },
            {
                where: {
                    id: shopId
                }
            }
        );

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
        res.status(500).json({ error: 'Internal Server Error' });
    }
}