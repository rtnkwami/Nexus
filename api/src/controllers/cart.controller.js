import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
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

export const placeOrder = async (req, res) => {
    try { 
        const { sub } = req.auth.payload;
        const cart = req.session.cart || [];
    
        if (cart.length === 0) { return res.status(400).json({ message: "Cart cannot be empty" }) };
    
        const user = await User.findOne({ where: { auth0_uid: sub } });
        const { cartWithDetails, cartTotal } = await enrichCart(cart);
    
        const order = await Order.create({
            UserId: user.id,
            details: cartWithDetails,
            total: cartTotal,
            status: 'pending'
        });
    
        req.session.cart = [];
    
        return res.status(201).json({
            success: true,
            orderId: order.id,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error("Error creating order: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}