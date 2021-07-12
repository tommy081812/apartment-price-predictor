var express = require('express');
var router = express.Router();
const mariadb = require('../maria');
var show_value = '';
var arr = [];
var prices = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    mariadb.query("SELECT DISTINCT dong FROM apart_price_clone ORDER BY dong", function(err, rows, fields) {
        console.log(rows);
        res.render('index', {title:'Search Your Apartment',  search_value:'', dong_list:rows});

      });
});

router.get('/:dong_value/:name_value', function(req, res, next) {
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;
    var search_value = '%' + name_value + '%';
    var page_num=0;
    mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE dong=? AND name LIKE ? ORDER BY name LIMIT ?,20",[dong_value, search_value,page_num], function(err, rows, fields) {
      if (!err) {
        arr = rows;
        console.log(rows);
        res.render('index', {title:'Search Results', arr:arr, search_value:name_value, page_num:page_num, dong_list:[d});
      } else {
        console.log("err: " + err);
        res.send(err);
      }
    });
  });

  router.get('/:dong_value/:name_value/:page_num', function(req, res, next) {
    var page_num=parseInt(req.params.page_num);
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;
    var search_value = '%' + name_value + '%';
    mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE dong=? AND name LIKE ? ORDER BY name LIMIT ?,20",[dong_value, search_value,page_num], function(err, rows, fields) {
      if (!err) {
        arr = rows;
        console.log(rows);
        res.render('index', {title:'Search Results', arr:arr, search_value:name_value, page_num:page_num, dong_list:[]]});
      } else {
        console.log("err: " + err);
        res.send(err);
      }
    });
  });


  /*
  router.get('/:search_value/:name_size', function(req, res, next) {
    var name = req.params.search_value.split('?')[0]
    var size = req.params.search_value.split('?')[1]
    mariadb.query("SELECT price, sold_date, floor FROM apart_price_clone WHERE name=? AND size=?",[name, size], function(err, rows, fields) {
      if (!err) {
        //var arr = JSON.parse(JSON.stringify(rows));
        console.log(rows);
        prices = rows;
        res.render('index', {title:'Express', arr:arr, search_value:show_value});
      } else {
        console.log("err: " + err);
        res.send(err);
      }
    });
  });
*/


module.exports = router;
