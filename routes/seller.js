const express = require('express')

const fs = require('fs')
var route = express.Router();
const contSeller = require('../controller/seller')


// ____________________________________

route.post('/insert', (req, res) => {
    let insert = "INSERT into products (ID,name,seller_id,price,image,description) values ('55','ProductNew','18','250','https://preview.colorlib.com/theme/amado/img/product-img/xproduct2.jpg.pagespeed.ic.JqJ-RgccAH.webp','..')";
    database.query(insert, (err) => {
        if (err) throw err;
        res.send("insert succefully");
    })
})

// ____________________________________

route.patch('/AddProduct/:id', (req, res) => {
    let Query = "UPDATE products SET name = ? WHERE id=" + req.params.id;
    database.query(Query, ["Product2"], (err, result) => {
        if (err) throw err;
        res.send("updated");
    });
});

// ____________________________________

route.delete('/Product/:id', (req, res) => {
    let Query = "DELETE FROM products WHERE id = " + req.params.id;
    database.query(Query, (err, result) => {
        if (err) throw err;
        res.send("deleted ");
    });
});



module.exports = route