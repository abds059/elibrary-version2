const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway injects DATABASE_URL automatically when a MySQL service is linked.
// Also supports DB_URL (manually set) or individual DB_* vars for local dev.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.DB_URL ||
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        }
      : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

module.exports = sequelize;
