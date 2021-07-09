var express = require('express');
var router = express.Router();
const mariadb = require('../maria');

/* GET home page. */
router.get('/', function(req, res, next) {
  mariadb.query('SELECT * FROM apart_price_clone LIMIT 5', function(err, rows, fields) {
    if (!err) {
      var arr = rows;
      res.render('index', {title:'Express', arr:rows});
    } else {
      console.log("err: " + err);
      res.send(err);
    }
  });
});


module.exports = router;
