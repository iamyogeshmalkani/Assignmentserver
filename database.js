import mysql from "mysql"

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yogesh@2002",
    database: 'cars_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});

export default connection;