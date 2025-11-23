const {DataTypes, or} = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organisation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organisations',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'teams',
    timestamps: true,
    underscored: true
});

module.exports = Team;