const maria = require('mysql');
const conn = maria.createConnection({
    host:'localhost',
    port: 3306,
    user:'sungkyun',
    password:'chung741',
    database:'sungkyun'
});
module.exports = conn;