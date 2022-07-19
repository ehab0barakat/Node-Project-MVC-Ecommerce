const express= require("express")

var app = express();
const fs=require('fs')
var mysql = require('mysql');
const cors = require('cors');
const sellerRoute=require('./routes/seller')
// 
app.use(cors());
app.use(express.json());
app.use("/seller",sellerRoute)
app.use(express.static("./static"))

// 
var route = express.Router();

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
    port:'3306',
	password:'',
	database:'node_project'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully');
	}
});
app.listen(4000);
// 
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    // connection.query('select * from users', (err, rows) => {
    //     if (!err)
    //         res.send(rows);
    //     else
    //         console.log(err);
    // })
    res.render("index");
});

// 
app.get('/description', (req, res) => {
    res.render("description");
});

// 
app.get('/shop', function(req, res) {
	let products;
	connection.query("SELECT * FROM products ", function (err, result, fields) {
	  if (err) {
		throw err;
	  } else {
		// console.log(result);
		res.render('products', {title: 'Shop', products: result});
	  }
	});
  });

app.listen(4000);


//   


app.get('/seller', function (req, res) {
    let seller;
    connection.query("SELECT * FROM products ", function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            res.render('seller', { title: 'seller', seller: result });
        }
    });
});
// -------------------- ( login && register started ) -----------------------
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env'});

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

db.connect( (error) => {
  if(error) {
    console.log(error)
  } else {
    console.log("MYSQL Connected...")
  }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5001, () => {
  console.log("Server started on Port 5001");
})

// -------------------- ( login && register ended ) -----------------------


