import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const User = sequelize.define('User',
    {
        auth0_uid: {
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'Users'
    }
);



export default User;