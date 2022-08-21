const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
var mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');


var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'node_project'
});


router.get('/', authController.isLoggedIn, (req, res) => {

  // console.log(req.user);
  //  user1 = req.user[0] ? req.user[0] : req.user ; 

  res.redirect("/shop");
});


// -------------------------------------


router.get('/register', authController.isLoggedIn, (req, res) => {
  db.query('SELECT * FROM users WHERE email =?', [req.cookies.email], (error, result) => {
    req.user = result;
    res.render('register', { message: "", user: req.user });
  });
});


// -------------------------------------

router.get('/login', authController.isLoggedIn, (req, res) => {
  // db.query('SELECT * FROM users WHERE email =?', [req.cookies.email], (error, result) => {
  // console.log(result);
  // req.user = result;
  res.render('login', { message: "", user: req.user });
  // res.render('register', { message : "" , user: req.user});
  // });
});


// -------------------------------------

router.get('/profile', authController.isLoggedIn, (req, res) => {

  console.log( req.user[0] );

  if (req.user[0]) {

    // console.log(req.user[0]);

    res.render('profile', { user: req.user });
  } else {
    res.redirect('/login');
  }

});

//----------------------(description)---------------
router.get('/description/:id',  authController.isLoggedIn , function(req, res) {
    


  
  var id =req.params.id;
  var sql = 'SELECT *  FROM products WHERE ID = ?';

  db.query(sql,[id], function(err, result, fields) {
      if (err){
          throw err;
      } else {
        res.render('description', {title: 'description', products: result , user : req.user });

      }
  });
});

// ------------------------------  ( shop ) ----------------------------------

router.get('/shop', authController.isLoggedIn, function (req, res) {

  db.query("SELECT * FROM products ", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('products', { title: 'Shop', products: result, user: req.user });
    }
  });
});



// ------------------------------  ( seller ) ----------------------------------

router.get('/seller', authController.isLoggedIn, function (req, res) {
  db.query("SELECT * FROM products where seller_id =? " ,[req.user[0].ID] , function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('sellerPage', { title: 'sellerPage', products: result, user: req.user });
    }
  });
});


// ADD product 
router.get('/addproducts',authController.isLoggedIn, function (req, res, next) {
  res.render('addproducts', {
    title: 'Add New Products',
    ID: '',
    name: '',
    seller_id: '',
    price: '',
    image: '',
    description: '',
    user: req.user
  })
})


//
router.post('/addproducts',authController.isLoggedIn, function (req, res, next) {

var name = req.body.name
var price = req.body.price
var description = req.bodydescriptione
var image = req.body.image
console.log("ehba")
  
db.query('INSERT INTO products SET ?', {name : name , price : price, description : description, image : image , seller_id : req.user[0].ID }, function (err, result) {
    if (err) {
      // req.flash('error', err)
      res.render('seller/addproducts', {
        title: 'Add New product',
        ID: product.id,
        name: product.name,
        seller_id: seller.id,
        price: product.price,
        image: product.image,
        description: product.description,
        user: req.user

      })
      res.redirect('/seller');
    } else {
      // req.flash('success', 'Data added successfully!');
      res.redirect('/seller');
    }
  })
})

// EDIT product FORM
router.get('/editproduct/:id',authController.isLoggedIn, function (req, res, next) {
  
  db.query('SELECT * FROM products WHERE id = ' + req.params.id, function (err, rows, fields) {
    if (err) {
      throw err
    }
    else {

      res.render('editproduct', {
        title: 'Edit product',
        ID: rows[0].ID,
        name: rows[0].name,
        seller_id: rows[0].seller_id,
        price: rows[0].price,
        image: rows[0].image,
        description: rows[0].description, user: req.user
      })
    }
  })
});

// UPdate product
router.post('/updateproduct/:id',authController.isLoggedIn, function (req, res, next) {
var form = req.body ;
var id = req.params.id ;
console.log(id);

  db.query(`UPDATE products SET name='${form.name}',price='${form.price}',image='${form.image}',description='${form.description}' WHERE ID= ${id} `, function (err, result) {
    if (err) {
      throw err;
      res.render('editproduct', {
        title: 'Edit product',
        ID: product.id,
        name: product.name,
        seller_id: seller.id,
        price: product.price,
        image: product.image,
        description: product.description, user: req.user
      })
    } else {
      res.redirect('/seller');
    }
  })
});


// DELETE product
router.get('/deleteproduct/(:id)',authController.isLoggedIn, function (req, res, next) {

  console.log( req.params.id );
  
  db.query(' delete FROM products WHERE ID = ?' , [+req.params.id], function (err, result) {
    
      if (err) {
        throw err;
      } else {
    console.log( result );
    res.redirect('/seller')
  }
  })
});

// -----------------------user operations-----------------------
router.get('/edit/:id',authController.isLoggedIn , function(req, res) {
    
  console.log( "req.user");
  console.log( req.user);
  
  
  var id =req.params.id;
  var sql = 'SELECT *  FROM users WHERE ID = ?';

  db.query(sql,[id], function(err, result, fields) {
      if (err){
          throw err;
      } else {
        
          // console.log(result);
        res.render('updateprofile', {title: 'description', products: result , user : req.user });

      }
    });
  });
router.post('/edit/:id',authController.isLoggedIn ,async function(req, res) {
;
   var id =req.params.id;
   var form = req.body;
   let hashedPassword = await bcrypt.hash(form.password, 6);
   console.log(form);
  var sql = `UPDATE users SET name='${form.name}',email='${form.email}',password='${hashedPassword }' WHERE ID= ${+id} `;
 
        db.query(sql, function(err, result, fields) {
          if (err){
              throw err;
          } else {

            res.redirect("/profile");
  }
});
});

// ------------------------------  ( add to cart ) ----------------------------------

router.post('/search', authController.isLoggedIn,function(req,res){
  var str = {
    stringPart: req.body.spearhead
  }


  db.query('SELECT * FROM products WHERE products.name LIKE "%'+str.stringPart+'%"',function(err, result, fields) {
    console.log(result);
    if (err) {
      throw err;
	  } else {
      res.render('products', {title: 'Shop', products: result , user : req.user });
	  }
  });
});





router.get('/add_to_cart/:id', authController.isLoggedIn, function (req, res) {

  // console.log(res);
  var id = req.params.id;
  var user_id = req.user[0].ID

  db.query(`select * from cart where product_id=${id} ` ,(error, results) => {
    if(results.length == 0) {
      db.query('INSERT INTO cart SET ?', { user_id: user_id, product_id: id }, (error, results) => {
        console.log(error);
      });
      };
  });
  res.redirect('/shop');
  // var sql = 'SELECT * FROM products WHERE ID = id';
});




router.get('/add_to_desc/:id', authController.isLoggedIn, function (req, res) {

  // console.log(res);
  var id = req.params.id;
  var user_id = req.user[0].ID

  db.query(`select * from cart where product_id=${id} ` ,(error, results) => {
    if(results.length == 0) {
      db.query('INSERT INTO cart SET ?', { user_id: user_id, product_id: id }, (error, results) => {
        console.log(error);
      });
    };
  });
  // var sql = 'SELECT * FROM products WHERE ID = id';

  res.redirect(`/description/${id}`);
});




// ------------------------------  ( remove from cart ) ----------------------------------

router.get('/remove_product/:id', authController.isLoggedIn, function (req, res) {

  //  var proId=req.params.id;
  
        var id =req.params.id;
      var sql = 'DELETE FROM cart WHERE product_id = ?';
  
      db.query(sql,[id], function(err, results, fields) {
          if (err){
              throw err;
          } else {
            
              
              res.redirect('/cart');
  
          }
  
        });
      });

// ------------------------------  ( cart products ) ----------------------------------

router.get('/cart', authController.isLoggedIn, function (req, res) {
  var id = req.user[0].ID;

  // console.log(req.user[0].ID);
  var sql = "SELECT products.ID, products.name , products.image, products.price  FROM products RIGHT JOIN cart ON products.ID = Product_id   WHERE cart.user_id =?";

  db.query(sql, [id], function (err, results, fields) {
    if (err) {
      throw err;
    } else {
      //  console.log(results);
      let totalPrice = 0;
      for (const prod of results) {
        totalPrice += prod.price
      }

      res.render('cart', { title: 'cart', user: req.user, products: results, total: totalPrice });

    }
  });

});
// ------------------------------  ( check out ) ----------------------------------

router.get('/checkout', authController.isLoggedIn, function (req, res) {

  var id=req.user[0].ID;
  var sql = "SELECT  cart.product_id  FROM cart WHERE cart.user_id =?";
  db.query(sql,[id], function(err, results, fields) {
    if (err){
        throw err;
    } else {
      var list = "" ;
      for (const prod in results) {
        if( results.length - 1  ==  prod   ){
          list += results[prod].product_id
        }else{
          list += results[prod].product_id + ","
        }
      }
      var target_list  = `(${list})` ;


    db.query('INSERT INTO ordered SET ?', { user_id: id , product_ids: target_list}, (error, results) => {
      if (err){
        throw err;
    } else {
      res.redirect("/order");
    }
   });
    }
  });

  });



// ------------------------------  ( Order page ) ----------------------------------

router.get('/order',  authController.isLoggedIn , function(req, res) {
  db.query("SELECT product_ids  FROM users , ordered where ordered.user_id = users.ID and email = ? GROUP by created_date desc", [req.cookies.email] , function (err, result, fields) {
	  if (err) {
		throw err;
	  } else {
      // console.log(result[0].product_ids);

      if (result.length != 0){
        db.query(`SELECT * from products where id in ${result[0].product_ids}`, function (err, result, fields) {
          if (err) {
            throw err;
          } else {
            var tot = 0;
            for (const prod of result) {
              tot += prod.price
            }
            res.render('order', { products: result, user: req.user, total: tot });
          };
        });
      }else{
        var tot = 0 ;
        for (const prod of result) {
          tot += prod.price
        }
        res.render('order', { products: result , user : req.user , total : tot});
      } 
    };
  });
});


// ------------------------------  ( thanks page ) ----------------------------------

router.get('/thankyou', authController.isLoggedIn, function (req, res) {

  db.query(`select ID from users WHERE email =?`, [req.cookies.email], function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      db.query(`DELETE FROM cart WHERE user_id =?`, [result[0].ID], function (err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.render('thankyou', { user: req.user });
        }
      });
    }
  });
});


module.exports = router;