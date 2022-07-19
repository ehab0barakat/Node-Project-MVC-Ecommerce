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
  // console.log(req.user);

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




// ------------------------------  ( Order page ) ----------------------------------

router.get('/order',  authController.isLoggedIn , function(req, res) {
  db.query("SELECT product_ids  FROM users , ordered where ordered.user_id = users.ID and email = ? GROUP by created_date", [req.cookies.email] , function (err, result, fields) {
	  if (err) {
		throw err;
	  } else {
      console.log(result);
      db.query(`SELECT * from products where id in ${result[0].product_ids}`, function (err, result, fields) {
        if (err) {
        throw err;
        } else {
          var tot = 0 ;
          for (const prod of result) {
            tot += prod.price
          }
  
          res.render('order', { products: result , user : req.user , total : tot});
        
        };
      });
    };
  });
});


// ------------------------------  ( thanks page ) ----------------------------------

router.get('/thankyou',  authController.isLoggedIn , function(req, res) {
  
  db.query(`select ID from users WHERE email =?`, [req.cookies.email] , function (err, result, fields) {
    if (err) {
    throw err;
    } else {
      db.query(`DELETE FROM cart WHERE user_id =?`, [result[0].ID] , function (err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.render('thankyou', { user : req.user });
        }
      });
    }
  });
});


module.exports = router;