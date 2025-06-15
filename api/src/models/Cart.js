import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Cart = sequelize.define('Cart',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sessionId: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'Carts'
    }
);

export default Cart;