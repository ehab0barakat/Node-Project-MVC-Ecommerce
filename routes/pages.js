const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
var mysql = require('mysql');
const cors = require('cors');

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

  // console.log( req.user[0] );

  if (req.user[0]) {

    // console.log(req.user[0]);

    res.render('profile', { user: req.user[0] });
  } else {
    res.redirect('/login');
  }

});

// ------------------------------  ( shop ) ----------------------------------

router.get('/shop', authController.isLoggedIn, function (req, res) {
  console.log("9999999")
  console.log(req.user);
  console.log("9999999")
  db.query("SELECT * FROM products ", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('products', { title: 'Shop', products: result, user: req.user });
    }
  });
});
// ------------------------------  ( seller ) ----------------------------------

// ------------------------------------------------------------------------------------

router.get('/seller', authController.isLoggedIn, function (req, res) {
  db.query("SELECT * FROM products ", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('seller/sellerPage', { title: 'sellerPage', products: result, user: req.user });
    }
  });
});


// ADD product 
router.get('/addproducts', function (req, res, next) {
  res.render('seller/addproducts', {
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
router.post('/addproducts', function (req, res, next) {
  db.query('INSERT INTO products SET ?', product, function (err, result) {
    if (err) {
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
    } else {
      res.redirect('seller/sellerPage');
    }
  })
});



// EDIT product FORM
router.get('/editproduct/:id', function (req, res, next) {
  db.query('SELECT * FROM products WHERE id = ' + req.params.id, function (err, rows, fields) {
    if (err) {
      throw err
    }
    else {
      res.render('seller/editproduct', {
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

// EDIT product
router.post('/updateproduct/:id', function (req, res, next) {
  db.query('UPDATE products SET ? WHERE id = ' + req.params.id, product, function (err, result) {
    if (err) {
      res.render('seller/editproduct', {
        title: 'Edit product',
        ID: product.id,
        name: product.name,
        seller_id: seller.id,
        price: product.price,
        image: product.image,
        description: product.description, user: req.user
      })
    } else {
      res.redirect('/seller/sellerPage');
    }
  })
});


// DELETE product
router.get('/deleteproduct/(:id)', function (req, res, next) {
  var product = { id: req.params.id }
  db.query('DELETE FROM products WHERE id = ' + req.params.id, product, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('/sellerPage')
    } else {
      req.flash('success', 'product deleted successfully! id = ' + req.params.id)
      res.redirect('/sellerPage')
    }
  })
});

// ------------------------------  ( add to cart ) ----------------------------------

router.post('/search', function (req, res) {
  var str = {
    stringPart: req.body.spearhead
  }

  router.get('/add_to_cart/:id', authController.isLoggedIn, function (req, res) {

    // console.log(res);
    var id = req.params.id;
    var user_id = req.user[0].ID

    // var sql = 'SELECT * FROM products WHERE ID = id';
    db.query('INSERT INTO cart SET ?', { user_id: user_id, product_id: id }, (error, results) => {
      console.log(error);

    });
    res.redirect('/shop');
  });
});



// ------------------------------  ( remove from cart ) ----------------------------------

router.get('/remove_product/:id', authController.isLoggedIn, function (req, res) {

  //  var proId=req.params.id;

  var id = req.params.id;
  var sql = 'DELETE FROM cart WHERE product_id = ?';

  db.query(sql, [id], function (err, results, fields) {
    if (err) {
      throw err;
    } else {


      res.redirect('/shop');

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

  var id = req.user[0].ID;
  var sql = "SELECT cart.user_id, cart.product_id  FROM cart WHERE cart.user_id =?";
  db.query(sql, [id], function (err, results, fields) {
    if (err) {
      throw err;
    } else {

      console.log(results);
      // var u_id=results[0].user_id;
      // var p_ids=`(${results[0].product_id},${results[1].product_id})`;
      // console.log(p_ids);


      // // res.render('order', { userID : u_id ,});
    }




  });

  db.query('SELECT * FROM products WHERE products.name LIKE "%' + str.stringPart + '%"', function (err, result, fields) {
    console.log(result);
    if (err) {
      throw err;
    } else {
      res.render('products', { title: 'Shop', products: result, user: req.user });
    }
  });
});

// ------------------------------  ( Order page ) ----------------------------------

router.get('/order', authController.isLoggedIn, function (req, res) {
  db.query("SELECT product_ids  FROM users , ordered where ordered.user_id = users.ID and email = ? GROUP by created_date", [req.cookies.email], function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      if (result.length != 0) {
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
      } else {
        res.render('order', { products: result, user: req.user, total: tot });
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