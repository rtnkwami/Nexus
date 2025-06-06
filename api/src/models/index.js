import User from "./User.js";
import Shop from "./Shop.js";
import Product from "./Product.js";
import { sequelize } from "../config/dbConfig.js";



User.hasOne(Shop);
Shop.belongsTo(User);

Shop.hasMany(Product);
Product.belongsTo(Shop);


export {
    sequelize,
    Shop,
    User,
    Product,
}