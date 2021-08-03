const { Pool } = require('pg')

module.exports = new Pool({
  user: 'postgres',
  password: 'Mariana27',
  host: 'localhost',
  port: 5432,
  database: 'launchstoredb',
  dialect: "postgres",
  define: {
    timestamps: true,
  }
})