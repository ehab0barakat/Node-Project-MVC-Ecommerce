const express = require('express')
var router = express.Router();
var mysql = require('mysql');

var Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'node_project'
});



module.exports = router;

