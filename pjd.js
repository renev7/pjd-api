
/**
 * node pjd init <myproject> <version>
 */

var fs = require('fs');
var mysql = require('mysql');

// Check for project initialization param
if(process.argv[2] == 'init') {

   // Get project name
   project = process.argv[3];

   // Get api version
   version = 'api/' + process.argv[4];

   // Create project directory structure
   var path = '/Users/rene/Documents/';

   fs.mkdirSync(path + project);
   fs.mkdirSync(path + project+'/config');
   fs.mkdirSync(path + project+'/connector');
   fs.mkdirSync(path + project+'/model');
   fs.mkdirSync(path + project+'/route');
   fs.mkdirSync(path + project+'/test');

   // Copy db.json template
   fs.writeFileSync(path + project + '/config/db.json', fs.readFileSync('db.json'));

   // Copy package.json template
   fs.writeFileSync(path + project + '/package.json', fs.readFileSync('template/package.json'));

   // Read connector template
   var data = fs.readFileSync('template/mysql-connector.js', 'utf8');
   var result = data.replace(/#PROJECT#/g, project.toUpperCase());
   fs.writeFileSync(path + project + '/connector/mysql-connector.js', result, 'utf8');

   // Copy app.js template
   //fs.writeFileSync(project + '/app.js', fs.readFileSync('template/app.js'));
   var data = fs.readFileSync('template/app.js', 'utf8');
   var result = data.replace(/#PROJECT#/g, project.toUpperCase());
   fs.writeFileSync(path + project + '/app.js', result, 'utf8');

   // Get project's database settings to extract database tables
   var env = require('./db.json')['db'];

   // Set db
   var pool = mysql.createPool({
      connectionLimit : 5,
      host : env.host,
      port: env.port,
      user : env.user,
      password : env.password,
      database : env.database
   });

   // TODO: Should return error if no db.json defined

   generateApi(pool, function () {
      console.log('Done.');
   });

} else {
   console.log('pjd init <project_name> <version>');
}

function generateApi(pool, callback) {

   pool.getConnection(function(err, connection) {

      // Get DB tables
      connection.query("show full tables where Table_Type = 'BASE TABLE'", function (err, rows, fields) {

        connection.release();

        if (err) throw err;

        // For each table...
        for (var i=0, len=rows.length; i<len; i++) {

        		// Get table from DB
            var table = rows[i]['Tables_in_' + env.database];

            // Read route file template
            var data = fs.readFileSync("template/route.js", "utf8");
            if (err) return console.err(err);

            // Replace #TABLE# with table name
            var result = data.replace(/#TABLE#/g, table);

            // Create route file <table>.js
            fs.writeFileSync(path + project + "/route/" + table + ".js", result, "utf8");
            if (err) return console.err(err);

            // Read template app.js
            data = fs.readFileSync(path + project + "/app.js", "utf8");
            if (err) return console.err(err);

            // Construct require and app.use directives
            var route = `var ${table} = require(\"./route/${table}.js\");\napp.use(\"/${version}/${table}\", ${table});\n\n//#ROUTE#`;
            var result = data.replace(/\/\/#ROUTE#/g, route);

            // Add route to app.js
            fs.writeFileSync(path + project + "/app.js", result, "utf8");
            if (err) return console.err(err);

            console.log(`Route ${table}.js created.`);

        } // for

        return callback(null);

       });

       pool.end();

   });

} // generateApi
