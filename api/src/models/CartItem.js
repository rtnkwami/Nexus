import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const CartItem = sequelize.define('CartItem',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'CartItems'
    }
);

export default CartItem;