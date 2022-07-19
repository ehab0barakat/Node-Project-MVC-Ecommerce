const express = require('express')
const contSeller = require('../controllers/seller')
var router = express.Router();
var mysql = require('mysql');

var Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'node_project'
});


// GET seller page.
router.get('/seller', function (req, res, next) {
  Connection.query('SELECT * FROM products', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('sellerPage', { title: "sellerPage", data: '' });
    } else {
      res.render('sellerPage', { title: "sellerPage", data: rows });
    }
  });
})


// ADD product 
router.get('/addproducts', function (req, res, next) {
  // render to views/user/add.ejs
  res.render('seller/addproducts', {
    title: 'Add New Products',
    ID: '',
    name: '',
    seller_id: '',
    price: '',
    image: '',
    description: '',
  })
})


//
router.post('/addproducts', function (req, res, next) {
    Connection.query('INSERT INTO products SET ?', product, function (err, result) {
      if (err) {
        req.flash('error', err)
        // render to views/user/add.ejs
        res.render('seller/addproducts', {
          title: 'Add New product',
          ID: product.id,
          name: product.name,
          seller_id: seller.id,
          price: product.price,
          image: product.image,
          description: product.description
          
        })
      } else {
        req.flash('success', 'Data added successfully!');
        res.redirect('/sellerPage');
      }
    })
  })

// EDIT product FORM
router.get('/editproduct/(:id)', function (req, res, next) {
  Connection.query('SELECT * FROM products WHERE id = ' + req.params.id, function (err, rows, fields) {
    if (err) throw err
    if (rows.length <= 0) {
      req.flash('error', 'products not found with id = ' + req.params.id)
      res.redirect('/sellerPage')
    }
    else {
      res.render('seller/editproduct', {
        title: 'Edit product',
        id: rows[0].id,
        name: rows[0].name,
        seller_id: rows[0].seller_id,
        price: rows[0].price,
        image: rows[0].image,
        description: rows[0].description
      })
    }
  })
})
// EDIT product
router.post('/updateproduct/:id', function (req, res, next) {
    Connection.query('UPDATE products SET ? WHERE id = ' + req.params.id, product, function (err, result) {
      if (err) {
        req.flash('error', err)
        // render to views/user/add.ejs
        res.render('seller/editproduct', {
          title: 'Edit product',
          ID: product.id,
          name: product.name,
          seller_id: seller.id,
          price: product.price,
          image: product.image,
          description: product.description
        })
      } else {
        req.flash('success', 'Data updated successfully!');
        res.redirect('/sellerPage');
      }
    })
  })

// DELETE product
router.get('/deleteproduct/(:id)', function (req, res, next) {
  var product = { id: req.params.id }
  Connection.query('DELETE FROM products WHERE id = ' + req.params.id, product, function (err, result) {
    //if(err) throw err
    if (err) {
      req.flash('error', err)
      // redirect to users list page
      res.redirect('/sellerPage')
    } else {
      req.flash('success', 'product deleted successfully! id = ' + req.params.id)
      // redirect to users list page
      res.redirect('/sellerPage')
    }
  })
})

module.exports = router;