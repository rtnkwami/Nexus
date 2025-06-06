import User from "./User.js";
import Shop from "./Shop.js";
import { sequelize } from "../config/dbConfig.js";



User.hasOne(Shop);
Shop.belongsTo(User);


export {
    sequelize,
    Shop,
    User
}