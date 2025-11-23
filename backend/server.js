const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {syncDatabase} = require('./models');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logRoutes = require('./routes/logs');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'HRMS API is running smoothly.',
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await syncDatabase();

        app.listen(PORT, () => {
            console.log(`
                Server is running on port ${PORT}
                Environment: ${process.env.NODE_ENV}
                API: http://localhost:${PORT}/api
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();