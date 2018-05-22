/*
 *
 * Summary
 * Contact
 *
 */

var bodyParser = require("body-parser");
var express = require("express");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Auth
const username = "#PROJECT#";
const password = "#PROJECT#";
const users = {};
users[username] = password;
const basicAuth = require('express-basic-auth');
app.use(basicAuth({
    users,
    challenge: true,
    realm: '#PROJECT#-API'
}));

// Routes

//#ROUTE#

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`API running on port: ${PORT}`);
});
