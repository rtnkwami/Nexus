import User from "./User.js";
import Shop from "./Shop.js";
import Product from "./Product.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import { sequelize } from "../config/dbConfig.js";



User.hasOne(Shop);
Shop.belongsTo(User);

User.hasOne(Cart);
Cart.belongsTo(User);

Shop.hasMany(Product);
Product.belongsTo(Shop);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });


export {
    sequelize,
    Shop,
    User,
    Product,
}