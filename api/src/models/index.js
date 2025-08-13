import User from "./User.js";
import Shop from "./Shop.js";
import Product from "./Product.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import ProductView from "./ProductView.js";
import { sequelize } from "../config/dbConfig.js";

User.hasOne(Shop);
Shop.belongsTo(User);

Shop.hasMany(Product);
Product.belongsTo(Shop);

Shop.hasMany(Order);
Order.belongsTo(Shop);

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);

OrderItem.belongsTo(Product);
Product.hasMany(OrderItem);

Product.hasMany(ProductView);
ProductView.belongsTo(Product);

export {
    sequelize,
    Shop,
    User,
    Product,
    Order,
    OrderItem,
    ProductView
}