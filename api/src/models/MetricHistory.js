import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const MetricHistory = sequelize.define('MetricHistory',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        value: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        category: {
            type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
            allowNull: false
        },

        periodStart: {
            type: DataTypes.DATE,
            allowNull: false
        },

        periodEnd: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },{
          tableName: 'MetricHistory',
          timestamps: true,
          indexes: [
              {
                  unique: true,
                  fields: ['MetricId', 'ShopId', 'category', 'periodStart']
              }
          ]
      }
);

export default MetricHistory;