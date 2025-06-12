import Product from "../models/Product.js";

export const addToCart = async (req, res) => { 
    try {
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
            existingProduct.quantity += quantity;
    
        } else {
            req.session.cart.push({ id, quantity })
    
        }
    
        return res.json({ cart: req.session.cart });

    } catch (error){
        console.error("Error adding product to cart: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}

export const getCart = async (req, res) => {
    try {
        if (!req.session.cart){
            req.session.cart = [];
        }
        return res.status(200).json({ cart: req.session.cart });

    } catch (error) {
        console.error("Error getting cart: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}