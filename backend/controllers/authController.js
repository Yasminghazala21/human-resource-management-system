const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Organisation, User} = require('../models');
const {logAction} = require('../utils/logger');

exports.register = async (req, res) => {
    try {
        const {organisationName, name, email, password} = req.body;

        if (!organisationName || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({where: {email}});

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const organisation = await Organisation.create({
            name: organisationName
        });

        const user = await User.create({
            organisation_id : organisation.id,
            name,
            email,
            password_hash: password
        });

        const token = jwt.sign(
            {
                userId: user.id,
                organisationId: organisation.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '8h'}
        );

        await logAction(
            user.organisation_id,
            user.id,
            'user_logged_in',
            'user',
            user.id
        );

        res.status(201).json({
            success: true,
            message: 'Organisation registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    organisationId: user.organisation_id,
                    organisationName: organisation.name
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering organisation',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({
            where: {email},
            include: [{model: Organisation}]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                organisationId: user.organisation_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '8h'}
        );

        await logAction(
            user.organisation_id,
            user.id,
            'user_logged_in',
            'user',
            user.id
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    organisationId: user.Organisation.id,
                    organisationName: user.Organisation.name
                }
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        await logAction(
            req.user.organisationId,
            req.user.userId,
            'user_logged_out',
            'user',
            req.user.userId
        );

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out'
        });
    }
};

