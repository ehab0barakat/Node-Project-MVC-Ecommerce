
const express= require("express")
var app = express();
var mysql = require('mysql');
const cors = require('cors');

var route = express.Router();

app.use(express.json());
app.use(cors());

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

app.set('view engine', 'ejs');

app.get('/description', (req, res) => {

	
    res.render("description");
});


app.listen(4000);




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









// const express= require("express")
// var app = express();
// var mysql = require('mysql');
// const cors = require('cors');
// // var bodyParser = require('body-parser')
// // var session= require('express-session');
// var cookieParser = require('cookie-parser')
// app.locals.siteTitle = 'ecommerce';

// var route = express.Router();

// app.use(express.json());
// app.use(cors());
// // app.use(bodyParser.urlencoded({ extended: true })) ;
// // secret is a key 
// // app.use(session({secret:"secret"}))
// app.use(cookieParser())

// var connection = mysql.createConnection({
// 	host:'localhost',
// 	user:'root',
//     port:'3306',
// 	password:'',
// 	database:'node_project'
// });
// connection.connect(function(error){
// 	if(!!error) {
// 		console.log(error);
// 	} else {
// 		console.log('Database Connected Successfully');
// 	}
// });

// app.set('view engine', 'ejs');
// app.get('/', (req, res) => {
//     // connection.query('select * from users', (err, rows) => {
//     //     if (!err)
//     //         res.send(rows);
//     //     else
//     //         console.log(err);
//     // })
//     res.render("index");
// });
// app.get('/description', (req, res) => {

	
//     res.render("description");
// });



// app.post('/cart',function(req,res){
  
//     var sql='SELECT FROM products on'



// })

// app.get('/add_to_cart/:id', function (req, res){
    
//     // console.log(res);
//    var id =req.params.id;
//     // var sql = 'SELECT * FROM products WHERE ID = id';
//     connection.query('INSERT INTO cart SET ?', { user_id: 1 , product_id: id}, (error, results) => {
//     //    console.log(error);
    
//     // });
//     // connection.query(sql, function(err, results, fields) {
//     //     if (err){
//     //         throw err;
//     //     } else {
//     //        console.log(results);
            
//     //     res.render('cart', {title: 'cart', products: results});
        
          
             

//         // }
//         res.redirect('/shop');
        
//         console.log(results);
//     });

// });

// // remove item 
// app.get('/remove_product/:id',function(req,res){
     
// //  var proId=req.params.id;

//     var sql = 'DELETE FROM cart WHERE product_id = id';
//       console.log(req);
//     connection.query(sql, function(err, results, fields) {
//         if (err){
//             throw err;
//         } else {
          
            
//             res.redirect('/shop');
          
            

//         }

// });
// });







// app.listen(4000);

// app.get('/shop', function(req, res) {
// 	let products;
// 	connection.query("SELECT * FROM products ", function (err, result, fields) {
// 	  if (err) {
// 		throw err;
// 	  } else {
// 		// console.log(result);
// 		res.render('products', {title: 'Shop', products: result});
// 	  }
// 	});
//   });





