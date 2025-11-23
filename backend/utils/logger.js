const { Log } = require('../models');
async function logAction(organisationId, userId, action, entityType, entityId, meta = {}) {
  try {
    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      meta,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Error writing log:', err);
  }
}
module.exports = { logAction };
