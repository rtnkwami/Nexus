import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const ProductView = sequelize.define('ProductView',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        viewedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'ProductViews',
        timestamps: false,
    }
);

export default ProductView;