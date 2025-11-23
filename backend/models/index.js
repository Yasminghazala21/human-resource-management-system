const sequelize = require('../config/database');
const Organisation = require('./Organisation');
const User = require('./User');
const Employee = require('./Employee');
const Team = require('./Team');
const EmployeeTeam = require('./EmployeeTeam');
const Log = require('./Log');

// Organisation associations
Organisation.hasMany(User, { foreignKey: 'organisation_id',
    onDelete: 'CASCADE' });
Organisation.hasMany(Employee, { foreignKey: 'organisation_id',
    onDelete: 'CASCADE' });
Organisation.hasMany(Team, { foreignKey: 'organisation_id',
    onDelete: 'CASCADE' });
Organisation.hasMany(Log, { foreignKey: 'organisation_id',
    onDelete: 'CASCADE' });

// User associations
User.belongsTo(Organisation, { foreignKey: 'organisation_id' });

// Employee associations
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Employee.belongsToMany(Team, {
    through: EmployeeTeam,
    foreignKey: 'employee_id',
    otherKey: 'team_id',
    as: 'teams',
});

// Team associations
Team.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Team.belongsToMany(Employee, {
    through: EmployeeTeam,
    foreignKey: 'team_id',
    otherKey: 'employee_id',
    as: 'employees',
});

// Log associations
Log.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('DB synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing DB:', error);
    }
};

module.exports = {
    sequelize,
    Organisation,
    User,
    Employee,
    Team,
    EmployeeTeam,
    Log,
    syncDatabase,
};