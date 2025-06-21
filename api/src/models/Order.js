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
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get() {
                const rawValue = this.getDataValue('total');
                return rawValue === null ? null : Number(rawValue);
            }
        }
    },
    {
        tableName: 'Orders'
    }
);

export default Order;