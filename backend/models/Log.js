const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organisation_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'organisations',
            key: 'id',
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    entity_type: {
        type: DataTypes.STRING(50),
    },
    entity_id: {
        type: DataTypes.INTEGER,
    },
    meta: {
        type: DataTypes.JSON,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'logs',
    timestamps: false,
});

module.exports = Log;