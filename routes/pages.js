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

// ------------------------------  ( add to cart ) ----------------------------------


router.get('/add_to_cart/:id', function (req, res){
    
    // console.log(res);
   var id =req.params.id;
    // var sql = 'SELECT * FROM products WHERE ID = id';
    db.query('INSERT INTO cart SET ?', { user_id: 1 , product_id: id}, (error, results) => {
       console.log(error);
    
    });
    
          
            
        res.redirect('/shop');
        
        // console.log(results);
  
});



// ------------------------------  ( remove from cart ) ----------------------------------

router.get('/remove_product/:id',function(req,res){
     
  //  var proId=req.params.id;
  
        var id =req.params.id;
      var sql = 'DELETE FROM cart WHERE product_id = ?';
  
      db.query(sql,[id], function(err, results, fields) {
          if (err){
              throw err;
          } else {
            
              
              res.redirect('/shop');
  
          }
  
        });
      });

// ------------------------------  ( cart products ) ----------------------------------

router.get('/cart',function(req,res){
  
   
  var sql = "SELECT products.ID, products.name , products.image, products.price  FROM products RIGHT JOIN cart ON products.ID = Product_id";
  // var sql='SELECT title, ID ,image ,price  FROM products  JOIN cart ON ID =product_id ORDER BY title'
      // console.log(sql);
  db.query(sql, function(err, results, fields) {
        if (err){
            throw err;
        } else {
          //  console.log(results);
            
        res.render('cart', {title: 'cart', products: results});
        
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