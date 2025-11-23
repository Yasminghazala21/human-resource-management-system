const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Organisation = sequelize.define('Organisation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255]
        }
    },
}, {
    tableName: 'organisations',
    timestamps: true,
    underscored: true
});

module.exports = Organisation;
