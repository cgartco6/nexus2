const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// POPIA Audit Log Model
const POPIAAudit = sequelize.define('POPIAAudit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  beforeState: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  afterState: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Log data access
async function logDataAccess(userId, action, entityType, entityId, beforeState = null, afterState = null) {
  try {
    await POPIAAudit.create({
      userId,
      action,
      entityType,
      entityId,
      beforeState: JSON.stringify(beforeState),
      afterState: JSON.stringify(afterState)
    });
  } catch (error) {
    console.error('POPIA Audit Log Error:', error);
  }
}

// Data anonymization for GDPR/POPIA compliance
function anonymizeData(data) {
  if (typeof data === 'object') {
    for (const key in data) {
      if (['email', 'phone', 'address', 'idNumber'].includes(key)) {
        data[key] = 'REDACTED';
      }
    }
  }
  return data;
}

module.exports = {
  logDataAccess,
  anonymizeData
};
