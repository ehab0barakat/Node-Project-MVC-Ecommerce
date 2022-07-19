
// var mysql = require('mysql');

// var Connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   port: '3306',
//   password: '',
//   database: 'node_project'
// });


// // 
// app.get('/products', (req, res) => {
//   mysqlConnection.query('SELECT * FROM products', (err, rows, fields) => {
//       if (!err)
//           res.send(rows);
//       else
//           console.log(err);
//   })
// });

// // ____________________________________

// route.post('/addproducts', (req, res) => {
//   let insert = "INSERT into products (ID,name,seller_id,price,image,description) values ('55','ProductNew','18','250','https://preview.colorlib.com/theme/amado/img/product-img/xproduct2.jpg.pagespeed.ic.JqJ-RgccAH.webp','..')";
//   database.query(insert, (err) => {
//       if (err) throw err;
//       res.send("insert succefully");
//   })
// })
// router.post('/addproducts', (req, res) => {
//     let insert = "INSERT into products (ID,name,seller_id,price,image,description) values ('55','ProductNew','18','250','https://preview.colorlib.com/theme/amado/img/product-img/xproduct2.jpg.pagespeed.ic.JqJ-RgccAH.webp','..')";
//     db.query(insert, (err) => {
//       if (err) throw err;
//       res.redirect('seller/sellerPage');
//     })
//   })
// // ____________________________________

// route.put('/Product/:id', (req, res) => {
//   let Query = "UPDATE products SET name = ? WHERE id=" + req.params.id;
//   database.query(Query, ["Product2"], (err, result) => {
//       if (err) throw err;
//       res.send("updated");
//   });
// });

// // ____________________________________

// route.delete('/Product/:id', (req, res) => {
//   let Query = "DELETE FROM products WHERE id = " + req.params.id;
//   database.query(Query, (err, result) => {
//       if (err) throw err;
//       res.send("deleted ");
//   });
// });

// //delete product
// app.delete('/product/:id', (req, res) => {
//   connection.query('delete from products where id=?', [req.params.id], (err, rows, fields) => {
//       if (!err)
//           res.send('product deleted successfully.')
//       else
//           res.send(err);
//   })
// });


