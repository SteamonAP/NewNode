const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'udproject',
    password: 'Steamonap@123'
});

module.exports = pool.promise();