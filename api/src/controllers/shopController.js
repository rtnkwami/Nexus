import Shop from "../models/Shop.js";
import { removeUndefined } from "../utils/cleanInputs.js";

export const updateShopMetadata =  async (req, res) => {
    const { id, name, description } = req.body.shop;

    const shopUpdate = removeUndefined({ name, description });

    try {
        const shop = await Shop.findByPk(id);
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
}