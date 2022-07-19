const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
  // console.log(req.user[0]);
  res.render('index', {
    user: req.user[0]
  });
});

router.get('/register', (req, res) => {

  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user[0] ) {
    res.render('profile', {
      user: req.user[0]
    });
  } else {
    res.redirect('/login');
  }
  
});

module.exports = router;