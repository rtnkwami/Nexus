import Shop from "../models/Shop.js";

export const createShop =  async (req, res) => {
    
    const { name, description } = req.body;

    try {
        const testShop = await Shop.create({ name, description });
        res.status(201).json(testShop);
        console.log(testShop.name);

    } catch (error) {
        console.error('Error creating shop: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}