import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Order = sequelize.define('Order',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
            defaultValue: 'pending'
        }
    },
    {
        tableName: 'Orders'
    }
);

export default Order;