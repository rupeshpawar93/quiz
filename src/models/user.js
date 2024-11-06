'use strict'
import bcrypt from 'bcrypt';
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 64],
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: [8, 64],
      },
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['username'],
      }
    ],
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
  });
  return User;
}

async function hashPassword(user) {
  if (user.password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);
  }
}

