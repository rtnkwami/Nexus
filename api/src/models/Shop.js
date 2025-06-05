import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Shop = sequelize.define('shop', 
    {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }
);

export default Shop;