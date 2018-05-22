/*
 *
 * MySQL DB connector
 * Rene von Borstel <rene@pjdev.net>
 * March, 2018
 *
 */

var mysql = require('mysql');
var env = require('../config/db.json')['db'];

var pool = mysql.createPool({
    connectionLimit : 5,
    host : process.env.#PROJECT#_HOST || env.host,
    port : process.env.#PROJECT#_PORT || env.port,
    user : process.env.#PROJECT#_USER || env.user,
    password : process.env.#PROJECT#_PASSWORD || env.password,
    database : process.env.#PROJECT#_DATABASE || env.database
});

module.exports = pool;
