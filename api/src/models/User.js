import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        auth0_uid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            required: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        tableName: 'Users'
    }
);



export default User;