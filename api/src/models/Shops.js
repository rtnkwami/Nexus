import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Shops = sequelize.define('shops', 
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

export default Shops;