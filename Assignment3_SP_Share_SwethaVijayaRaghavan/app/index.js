const bcrypt = require('bcrypt');
const shortid = require('shortid');

// DB Connection
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ZipSwetha!911',
    database: 'sp_share_new'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});
var express = require("express"),
    index = express(),
    http = require("http").Server(index);
var bodyParser = require("body-parser");
var app = express();
const jwt = require('jsonwebtoken');
const config = require('./config.js');
const saltRounds = 10;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log("Working on port 3000");
});

app.get('/user/:username', function (req, res) {
    console.log(res);
    connection.query("SELECT actualname,loginname, groupname, userid FROM sp_share.userz WHERE loginname = '" + connection.escape(req.params.username) + "'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
    res.send(500);
});

app.get('/', function (req, res) {
    res.send("App is Live ......");
    console.log("App is Live");
})

app.get('/me', function (req, res) {
    //var token = req.headers['Bearer'];
    var xx = req.header('authorization');
    TokenArray = xx.split(" ");
    var token = TokenArray[1];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        if (!err) {
            connection.query("SELECT loginname FROM sp_share.userz WHERE loginname = " + connection.escape(decoded.loginname) + " AND jwt = " + connection.escape(token) + " AND istokengenerated = true", function (error, result) {
                if (result) {
                    res.status(200).send(decoded);
                }
            });
        }
    });
});

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
app.use('/auth',require('./routes/auth')(connection,bcrypt,jwt,config,shortid));
app.use('/groups',require('./routes/groups')(connection,bcrypt,jwt,config,shortid));
app.use('/items',require('./routes/items')(connection,bcrypt,jwt,config,shortid));
app.use('/storage',require('./routes/storage')(connection,bcrypt,jwt,config,shortid));