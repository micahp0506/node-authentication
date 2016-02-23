'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';

const userRoutes = require('./lib/user/routes');

app.set('view engine', 'jade');
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(flash());

app.use(userRoutes);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.get('/', (req, res) => {
  res.render('index', {message: req.flash});
});

mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
    if (err) throw (err)

    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});



