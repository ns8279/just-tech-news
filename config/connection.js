//import the Sequelize constructor from the library
const Sequelize = require('sequelize');
require('dotenv').config();

//const PORT = process.env.PORT || 3001

//connection to our database, pass in your MySQL information
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;