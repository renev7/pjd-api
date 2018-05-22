/*
 *
 * API Generator
 * #TABLE#.js
 * Contact
 *
 */

var express = require("express");
var bodyParser = require("body-parser");
var pool = require("../connector/mysql-connector.js");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.use(function(req, res, next) {
    console.log("Calling #TABLE#...");
    next();
});

router.get("/", function(req, res) {
    pool.getConnection(function(err, connection) {
    	
	    	var sql = "select * from v#TABLE#";
	    	
	    	// paginating
	    	var limit = req.query.limit;
	    	var offset = req.query.offset;
	    	var sql = sql.concat(" limit ", limit, " offset ", offset);
	    	
	    	connection.query(sql, function (err, rows, fields) {
            connection.release();
            if (err) throw err;
            res.json(rows);
        });
    });
})

router.post("/", function(req, res) {
    var values = req.body;
    pool.getConnection(function(err, connection) {
        connection.query("insert into #TABLE# set ?", values, function (err, rows, fields) {
            connection.release();
            if (err) throw err;
            res.json({message: "insert"});
        });
    });
})

router.get("/:id", function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query("select * from v#TABLE# where #TABLE#Id = ?", [req.params.id], function (err, rows, fields) {
            connection.release();
            if (err) throw err;
            res.json(rows);
        });
    })
})

router.delete("/:id", function(req, res) {
    pool.getConnection(function(err, connection) {
    	
    		if(req.query	.delete=="true") {
	        connection.query("delete from #TABLE# where #TABLE#Id = ?", [req.params.id], function (err, rows, fields) {
	            connection.release();
	            if (err) throw err;
	            res.json({message: "delete"});
	        });
    		} else {
    			connection.query("update #TABLE# set status=\"false\" where #TABLE#Id = ?", [req.params.id], function (err, rows, fields) {
    	            connection.release();
    	            if (err) throw err;
    	            res.json({message: "update"});
    	        });
    		}
    });
})

router.put("/:id", function(req, res) {
    pool.getConnection(function(err, connection) {
        var update = "update #TABLE# set ? where #TABLE#Id = ?";
        connection.query(update, [req.body, req.params.id], function (err, rows, fields) {
            connection.release();
            if (err) throw err;
            res.json({message: "update"});
        });
    });
})

module.exports = router;
