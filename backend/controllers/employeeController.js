const {Employee, Team} = require('../models');
const {logAction} = require('../utils/logger');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: {organisation_id: req.user.organisationId},
            include: [{
                model: Team,
                as: 'teams',
                through: {attributes: []}
            }],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees'
        });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: {
                id: req.params.id,
                organisation_id: req.user.organisationId
            },
            include: [{
                model: Team,
                as: 'teams',
                through: {attributes: []}
            }]
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employee'
        });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const {first_name, last_name, email, phone, position, department} = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: 'First name and last name are required'
            });
        }

        const employee = await Employee.create({
            organisation_id: req.user.organisationId,
            first_name,
            last_name,
            email,
            phone,
            position,
            department
        });

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'employee_created',
            'employee',
            employee.id,
            {first_name, last_name, email}
        );

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const {first_name, last_name, email, phone, position, department} = req.body;

        const employee = await Employee.findOne({
            where: {
                id: req.params.id,
                organisation_id: req.user.organisationId
            }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await employee.update({
            first_name: first_name || employee.first_name,
            last_name: last_name || employee.last_name,
            email: email || employee.email,
            phone: phone || employee.phone,
            position: position || employee.position,
            department: department || employee.department
        });

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'employee_updated',
            'employee',
            employee.id,
            {first_name, last_name}
        );

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee'
        });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: {
                id: req.params.id,
                organisation_id: req.user.organisationId
            }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const employeeData = {
            id: employee.id,
            name: `${employee.first_name} ${employee.last_name}`
        };

        await employee.destroy();

        await logAction(
            req.user.organisationId,
            req.user.userId,
            'employee_deleted',
            'employee',
            employeeData.id,
            {name: employeeData.name}
        );

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
    }
};