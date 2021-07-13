var express = require('express');
var router = express.Router();
const mariadb = require('../maria');
//const chart = require('../commitChart');
var show_value = '';
var arr = [];
var prices = [];
let dong_list =[];
var total_page = 0;
mariadb.query("SELECT DISTINCT dong FROM apart_price_clone ORDER BY dong", function(err, rows, fields) {
    if(!err){
        dong_list=rows;
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
        res.render('index', {title:'Search Your Apartment',  search_value:'', dong_list:dong_list, dong_value:'', total_page:total_page, arr:arr});

});

router.get('/:dong_value/:name_value', function(req, res, next) {
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;
    var search_value = '%' + name_value + '%';
    var page_num=0;
    var total_page=0;
    if (dong_value != "any") {
        mariadb.query("SELECT COUNT(DISTINCT street_adress, dong, name) FROM apart_price_clone WHERE dong=? AND name LIKE ?",[dong_value, search_value], function(err, num, fields) {
            if (!err) {
                total_page=num[0]['COUNT(DISTINCT street_adress, dong, name)']/20+1;
                if (total_page>10) {total_page=10;}
            }
        });

        mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE dong=? AND name LIKE ? ORDER BY name LIMIT 20 OFFSET ?",[dong_value, search_value,page_num], function(err, rows, fields) {
            if (!err) {
                arr = rows;
                res.render('index', {title:'Search Results', arr:arr, search_value:name_value, page_num:page_num, dong_list:dong_list, dong_value:dong_value, total_page:total_page});
            }
        });
    } else {
        mariadb.query("SELECT COUNT(DISTINCT street_adress, dong, name) FROM apart_price_clone WHERE name LIKE ?",[search_value], function(err, num, fields) {
            if (!err) {
                total_page=num[0]['COUNT(DISTINCT street_adress, dong, name)']/20+1;
                if (total_page>10) {total_page=10;}
            }
        });

        mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE name LIKE ? ORDER BY name LIMIT 20 OFFSET ?",[search_value,page_num], function(err, rows, fields) {
            if (!err) {
                arr = rows;
                res.render('index', {title:'Search Results', arr:arr, search_value:name_value, page_num:page_num, dong_list:dong_list, dong_value:dong_value, total_page:total_page});
            }
        });
    }
  });

  router.get('/:dong_value/:name_value/:page_num', function(req, res, next) {
    var page_num=(parseInt(req.params.page_num)-1) * 20;
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;
    var search_value = '%' + name_value + '%';
    if (dong_value != "any") {
        mariadb.query("SELECT COUNT(DISTINCT street_adress, dong, name) FROM apart_price_clone WHERE dong=? AND name LIKE ?",[dong_value, search_value], function(err, num, fields) {
            if (!err) {
                total_page=num[0]['COUNT(DISTINCT street_adress, dong, name)']/20+1;
                if (total_page>10) {total_page=10;}
            }
        });

        mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE dong=? AND name LIKE ? ORDER BY name LIMIT 20 OFFSET ?",[dong_value, search_value,page_num], function(err, rows, fields) {
            if (!err) {
                arr = rows;
                res.render('index', {title:'Search Results', arr:arr, dong_value:dong_value,search_value:name_value, page_num:page_num, dong_list:dong_list, total_page:total_page});
            }
        });
    } else {
        mariadb.query("SELECT COUNT(DISTINCT street_adress, dong, name) FROM apart_price_clone WHERE dong=? AND name LIKE ?",[dong_value, search_value], function(err, num, fields) {
            if (!err) {
                total_page=num[0]['COUNT(DISTINCT street_adress, dong, name)']/20+1;
                if (total_page>10) {total_page=10;}
            }
        });

        mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE name LIKE ? ORDER BY name LIMIT 20 OFFSET ?",[search_value,page_num], function(err, rows, fields) {
            if (!err) {
                arr = rows;
                res.render('index', {title:'Search Results', arr:arr, dong_value:dong_value,search_value:name_value, page_num:page_num, dong_list:dong_list, total_page:total_page});
            }
        });
    }
  });

  router.get('/:dong_value/:name_value/graph', function(req, res, next) {
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;
    mariadb.query("SELECT price, sold_date FROM apart_price_clone WHERE dong=? AND name=?", [dong_value, name_value], function(err, rows, fields) {

    });
    //chart.renderChart();
  });
 
  module.exports = router;

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