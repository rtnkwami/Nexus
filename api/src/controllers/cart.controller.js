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
    
        // Check if product is already in cart and increase by incoming qty or add to cart
        const existingProduct = req.session.cart.find(item => item.id === id);
        if (existingProduct) { 
            existingProduct.quantity += quantity;
    
        } else {
            req.session.cart.push({ id, quantity });
    
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

        const cart = req.session.cart;

        const productIds = cart.map(item => item.id);
        const products = await Product.findAll({
        where: {
            id: productIds
        }
        });

        const productMap = Object.fromEntries(
            products.map(product => [product.id, product])
        );

        let cartTotal = 0;

        const cartWithDetails = cart.map(cartItem => {
            const product = productMap[cartItem.id];
            let totalProductPrice = Math.round((cartItem.quantity * product.price) * 100) / 100;
            cartTotal += totalProductPrice;
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                quantity: cartItem.quantity
            };
        });

        return res.status(200).json({ cart: cartWithDetails, cartTotal });

    } catch (error) {
        console.error("Error getting cart: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const product = req.session.cart.find(item => item.id === id);
        if (product) {
            req.session.cart = req.session.cart.filter(item => item.id !== id);
            
            return res.status(200).json({ 
                message: "Product removed from cart successfully",
                removedProduct: product,
                cart: req.session.cart
            });
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }

    } catch (error) {
        console.error("Error removing product from cart: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}