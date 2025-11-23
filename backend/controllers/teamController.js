const {Team, Employee, EmployeeTeam} = require('../models');
const {logAction} = require('../utils/logger');

exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.findAll({
            where: {organisation_id: req.user.organisationId},
            include: [{
                model: Employee,
                as: 'employees',
                through: {attributes: []}
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({
            success: false, 
            message: 'Error fetching teams'
        });
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findOne({
            where: {
                id: req.params.id,
                organisation_id: req.user.organisationId
            },
            include: [{
                model: Employee,
                as: 'employees',
                through: {attributes: ['assigned_at']}
            }]
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching team'
        });
    }
};

exports.createTeam = async (req, res) => {
    try {
        const {name, description} = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Team name is required'
            });
        }

        const team = await Team.create({
            organisation_id: req.user.organisationId,
            name,
            description
        });

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'team_created',
            'team',
            team.id,
            {name}
        );

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: team
        });
    }
    catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating team'
        });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const {name, description} = req.body;

        const team = await Team.findOne({
            where: {
                id: req.params.id,
                organisation_id: req.user.organisationId
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.update({
            name: name || team.name,
            description: description !== undefined ? description : team.description
        });

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'team_updated',
            'team',
            team.id,
            {name: team.name}
        );

        res.status(200).json({
            success: true,
            message: 'Team updated successfully',
            data: team
        });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating team'
        });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findOne({
            where: {
                id: req.params.id,
                organisation_id: req.user.organisationId
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const teamData = {id: team.id, name: team.name};
        await team.destroy();

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'team_deleted',
            'team',
            teamData.id,
            {name: teamData.name}
        );

        res.status(200).json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting team'
        });
    }
};

exports.assignEmployees = async (req, res) => {
    try {
        const {employeeIds} = req.body;
        const teamId = req.params.id;

        if(!employeeIds || !Array.isArray(employeeIds)) {
            return res.status(400).json({
                success: false,
                message: 'employeeIds must be an array'
            });
        }

        const team = await Team.findOne({
            where: {
                id: teamId,
                organisation_id: req.user.organisationId
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const employees = await Employee.findAll({
            where: {
                id: employeeIds,
                organisation_id: req.user.organisationId
            }
        });

        if (employees.length !== employeeIds.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more employees not found in the organisation'
            });
        }

        const assignments = [];
        for (const employeeId of employeeIds) {
            const [assignment, created] = await EmployeeTeam.findOrCreate({
                where: {
                    employee_id: employeeId,
                    team_id: teamId
                }
            });

            if (created) {
                assignments.push(assignment);

                await logAction(
                    req.user.organisationId,
                    req.user.userId,
                    'employee_assigned_to_team',
                    'employee_team',
                    assignment.id,
                    {employeeId, teamId, teamName: team.name}
                );
            }
        }

        res.status(200).json({
            success: true,
            message: `${assignments.length} employee(s) assigned to team`,
            data: assignments
        });
    }
    catch (error) {
        console.log('Error assigning employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning employees to team'
        });
    }
};

exports.removeEmployee = async (req, res) => {
    try {
        const {teamId, employeeId} = req.params;

        const assignment = await EmployeeTeam.findOne({
            where: {employee_id: employeeId, team_id: teamId}
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'employee_removed_from_team',
            'employee_team',
            assignment.id,
            {employeeId, teamId}
        );

        res.status(200).json({
            success: true,
            message: 'Employee removed from team'
        });
    }
    catch (error) {
        console.error('Error removing employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing employee from team'
        });
    }
};