import { sequelize } from "../config/dbConfig.js";
import { DataTypes, UUIDV4 } from "sequelize";

const OrderItem = sequelize.define('OrderItem',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            required: true
        },
        priceAtTime: {
            type: DataTypes.DECIMAL(10, 2),
            get() {
                const rawValue = this.getDataValue('price');
                return rawValue === null ? null : Number(rawValue);
            },
            allowNull: false,
            required: true
        }            
    },
    {
        tableName: 'OrderItems',
        timestamps: false
    }
);

export default OrderItem;