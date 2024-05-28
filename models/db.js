const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simpledb',
    port: '3306'
});

db.connect(err => {
    if (err) {
        console.log(err, 'dberr');
    } else {
        console.log("Base de donnée connectée");
    }
});

module.exports = db;