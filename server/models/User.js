const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encryptData } = require('../utils/security');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // Automatically hash password before saving
      this.setDataValue('password', encryptData(value));
    }
  },
  role: {
    type: DataTypes.ENUM('owner', 'client'),
    allowNull: false,
    defaultValue: 'client'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (user) => {
      // Additional security measures
      user.email = encryptData(user.email);
      if (user.phone) user.phone = encryptData(user.phone);
    }
  }
});

module.exports = User;
