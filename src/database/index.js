const Sequelize = require('sequelize')
const dbConfig = require('../config/db')

const connection = new Sequelize(dbConfig)

module.exports = connection;