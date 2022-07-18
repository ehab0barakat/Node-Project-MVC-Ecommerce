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
app.get('/', (req, res) => {
    // connection.query('select * from users', (err, rows) => {
    //     if (!err)
    //         res.send(rows);
    //     else
    //         console.log(err);
    // })
    res.render("index");
});
app.get('/description', (req, res) => {

	
    res.render("description");
});


app.listen(4000);

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





