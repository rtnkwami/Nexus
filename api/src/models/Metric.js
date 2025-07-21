import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConfig.js';

const Metric = sequelize.define('Metric', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
},
    {
        tableName: 'Metrics'
    }
);

export default Metric;