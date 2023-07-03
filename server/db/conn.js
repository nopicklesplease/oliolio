const Sequelize = require('sequelize');

if(process.env.QUIET){
  config.logging = false;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/portfolio_tracker');

module.exports = conn;
