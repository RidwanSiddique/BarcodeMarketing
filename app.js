var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();
    
// Database Connection
var connect = "postgres://admin:admin@localhost/BarcodeMarketingDB";

// Assignn Dust engine to .dust files

app.engine('dust', cons.dust);

// Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.render('index');
});

// Servers
app.listen(3000, function(){
    console.log('Server Started on Port 3000');
});