import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
    const { id, quantity } = req.body;

    if (!req.session.cart){
        req.session.cart = [];
    }

    const product = await Product.findByPk(id);
    if (!product){
        return res.status(400).json({ message: "Invalid product id" });
    }

    const existingProduct = req.session.cart.find(item => item.id === id);
    if (existingProduct) { 
        existingProduct.quantity += quantity

    } else {
        req.session.cart.push({ id, quantity })

    }

    res.json({ cart: req.session.cart });
    console.log(req.session.id);

}