import Product from "../models/Product.js";

export const enrichCart = async (cart) => {
    if (!cart || cart.length === 0) {
        return { cartWithDetails: [], cartTotal: 0 };
    }

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

    return { cartWithDetails, cartTotal };
}