const mysql = require('mysql2');
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    database: process.env.database,
    password: process.env.password
});

pool.getConnection((err,connection) =>{
    if(err) {
        console.log("unable to connect to MySQL",err);
    } else{
        console.log("Connected to MySQL");
        connection.release();
    }
});

module.exports = pool.promise();