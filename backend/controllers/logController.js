const { Log, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllLogs = async (req, res) => {
  try {
    const { action, startDate, endDate, limit = 100 } = req.query;

    const whereClause = { organisation_id: req.user.organisationId };

    if (action) {
      whereClause.action = action;
    }

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
      if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
    }

    const logs = await Log.findAll({
      where: whereClause,
      include: [{ 
        model: User, 
        attributes: ['id', 'name', 'email'],
        required: false
      }],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching logs',
      error: error.message
    });
  }
};
