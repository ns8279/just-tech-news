const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
//==================
const path = require('path');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers'); //helpers
const hbs = exphbs.create({ helpers });

//=====Session
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); //necessary for POST 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//==Session path
app.use(session(sess));
//===============================
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => { //once you have the association in index.js file , change the force = true and start the server to drop and create the tables. Once thats done, change it back to false
  app.listen(PORT, () => console.log('Now listening'));
});