import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Cart = sequelize.define('Cart',
    {
        id: {
            types: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sessionId: {
            types: DataTypes.UUIDV4
        }
    },
    {
        tableName: 'Carts'
    }
);

export default Cart;