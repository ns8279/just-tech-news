const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); //necessary for POST 
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => { //once you have the association in index.js file , change the force = true and start the server to drop and create the tables. Once thats done, change it back to false
  app.listen(PORT, () => console.log('Now listening'));
});