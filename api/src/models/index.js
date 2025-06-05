import User from "./User.js";
import Shop from "./Shop.js";
import { sequelize } from "../config/dbConfig.js";



Shop.belongsToMany(User, { through: 'ShopUser'});
User.belongsToMany(Shop, { through: 'ShopUser' })


export {
    sequelize,
    Shop,
    User
}