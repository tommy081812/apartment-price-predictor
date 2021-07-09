var express = require('express');
var router = express.Router();
const mariadb = require('../maria');
var show_value = '';
var arr = [];
var prices = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title:'Express', arr:[], search_value:''});
});
router.get('/:search_value', function(req, res, next) {
    show_value = req.params.search_value;
    var search_value = '%' + req.params.search_value + '%';
    mariadb.query("SELECT DISTINCT street_adress, dong, name, size FROM apart_price_clone WHERE name LIKE ? ORDER BY name",[search_value], function(err, rows, fields) {
      if (!err) {
        //var arr = JSON.parse(JSON.stringify(rows));
        arr = rows;
        console.log(rows);
        res.render('index', {title:'Express', arr:arr, search_value:show_value});
      } else {
        console.log("err: " + err);
        res.send(err);
      }
    });
  });
  router.get('/:search_value/:name_size', function(req, res, next) {
    var name = req.params.search_value.split('?')[0]
    var size = req.params.search_value.split('?')[1]
    mariadb.query("SELECT price, sold_date, floor FROM apart_price_clone WHERE name=? AND size=?",[name, size], function(err, rows, fields) {
      if (!err) {
        //var arr = JSON.parse(JSON.stringify(rows));
        console.log(rows);
        prices = rows;
        res.render('index', {title:'Express', arr:arr, search_value:show_value, prices:prices});
      } else {
        console.log("err: " + err);
        res.send(err);
      }
    });
  });



module.exports = router;
