'use strict'


const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('./model');

require('./local');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login',
    passport.authenticate('local', {
        successFlash: 'Your are now signed in!',
        successRedirect: '/',
        failureFlash: 'Incorrect Email or Password',
        failureRedirect: '/login'
        }
    )
    // req.session.user = user;
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err) => {
          if (err) throw err;

          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});

router.delete('/login', (req, res) => {
    req.session.regenerate (function (err){
        if (err) throw (err);

        res.redirect('/')
    });
});

module.exports = router;

