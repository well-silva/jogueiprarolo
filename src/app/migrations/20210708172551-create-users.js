'use strict';

const { DataTypes } = require("sequelize/types");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', { 
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autorIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpf_cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      cep: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reset_token: {
        type: DataTypes.STRING
      },
      resert_token_expires: {
        type: DataTypes.STRING
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
