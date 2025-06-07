import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Product = sequelize.define('Product', 
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            get() {
                const rawValue = this.getDataValue('price');
                return rawValue === null ? null : Number(rawValue);
            },
            allowNull: false,
            required: true
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'Products'
    }
);

export default Product;