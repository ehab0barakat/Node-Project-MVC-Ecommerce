const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
var mysql = require('mysql');
const cors = require('cors');

var db = mysql.createConnection({
	host:'localhost',
	user:'root',
    port:'3306',
	password:'',
	database:'node_project'
});


router.get('/', authController.isLoggedIn, (req, res) => {
  console.log(req.user);

  //  user1 = req.user[0] ? req.user[0] : req.user ; 

  res.redirect("/shop");
});


// -------------------------------------


router.get('/register', (req, res) => {
  
  res.render('register', { message : "" , user: false });
});


// -------------------------------------

router.get('/login', (req, res) => {
  res.render('login' , { message : "" , user: false});
});


// -------------------------------------

router.get('/profile', authController.isLoggedIn, (req, res) => {
  
  if( req.user[0] ) {

    console.log(req.user[0]);
    
    res.render('profile', { user : req.user[0] });
  } else {
    res.redirect('/login');
  }
  
});


// ------------------------------  ( shop ) ----------------------------------

router.get('/shop',  authController.isLoggedIn , function(req, res) {
	db.query("SELECT * FROM products ", function (err, result, fields) {
	  if (err) {
		throw err;
	  } else {
		res.render('products', {title: 'Shop', products: result , user : req.user });
	  }
	});
});


module.exports = router;