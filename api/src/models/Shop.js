import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Shop = sequelize.define('Shop', 
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'Shops'
    }
);

export default Shop;