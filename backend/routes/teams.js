const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.post('/:id/assign', teamController.assignEmployees);
router.delete('/:teamId/employees/:employeeId', teamController.removeEmployee);

module.exports = router;