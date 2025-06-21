import Product from "../models/Product.js";
import { enrichCart } from "../utils/enrichCart.js";

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

        const { cartWithDetails, cartTotal } = await enrichCart(req.session.cart);

        return res.status(200).json({ cart: cartWithDetails, cartTotal });

    } catch (error) {
        console.error("Error getting cart: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = req.session.cart.find(item => item.id === productId);
        if (product) {
            req.session.cart = req.session.cart.filter(item => item.id !== productId);
            
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

export const editCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!req.session.cart) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const product = req.session.cart.find(item => item.id === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" });
        }

        product.quantity = quantity;

        return res.status(200).json({ 
            message: "Cart item updated successfully",
            updatedCartItem: product,
            cart: req.session.cart
        });

    } catch (error) {
        console.error("Error editing cart item: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}