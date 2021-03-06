var express = require('express');
var router = express.Router();
const mariadb = require('../maria');
const commonFunc = require('../commonfunc');

mariadb.query("SELECT DISTINCT dong FROM apart_price_clone ORDER BY dong", function(err, rows, fields) {
    if(!err){
        dong_list=rows;
    }
});

function renderIndex(res,render_data){
    if(render_data.price_list && render_data.total_page){
        res.render('index',render_data);
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title:'Find Your Apartment Price in Seoul, Korea', price_list:[], name_value:'', dong_list:dong_list, dong_value:'Any', total_page:1});
});


router.get('/:dong_value/:name_value/:curr_page', function(req, res, next) {
    var dong_value, name_value, curr_page;
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;
    curr_page = req.params.curr_page;

    var render_data = {
        title:'Choose Your Apartment',
        price_list:false,
        name_value:name_value,
        curr_page:curr_page,
        dong_list:dong_list,
        dong_value:dong_value,
        total_page:false
    };

    commonFunc.getMaxPage(dong_value, name_value).then(function(total_page){
        render_data.total_page=total_page;
        renderIndex(res,render_data);
    }, function() {
        console.log("error on getMaxPage");
    });

    commonFunc.getPrices(dong_value, name_value, curr_page).then(function(price_list){
        render_data.price_list=price_list;
        renderIndex(res,render_data);
    }, function(err) {
        console.log("error on getPrices:" + err);
    });

});


  router.get('/:dong_value/:name_value', function(req, res, next) {
    var dong_value, name_value;
    dong_value = req.params.dong_value;
    name_value = req.params.name_value;


    mariadb.query("SELECT price, sold_date, size FROM apart_price_clone WHERE name=? AND dong=?", [name_value, dong_value], function(err, rows, fields) {
        if (!err) {
            var size_list = {};
            var newStr ='';
            //var price =[];
            //var date = [];
            for (var i=0; i < rows.length; i++) {
                var size = rows[i]['size'];
                if (!(size in size_list)) {
                    size_list[size] = [[], [], []];
                }
                size_list[size][0].push(rows[i]['price']);
                size_list[size][1].push(rows[i]['sold_date']);
                //price[i] = rows[i]['price'];
                //date[i] = rows[i]['sold_date'];
            }
            mariadb.query("SELECT DISTINCT p.size, p.price FROM apart_price_clone AS a, prediction AS p WHERE a.dong=? AND a.name=? AND a.street_adress_code=p.street_adress_code AND p.size=a.size", [dong_value, name_value], function(err, rows, fields) {
                if (!err) {
                    console.log(rows);
                    for (var i=0; i < rows.length; i++) {
                        console.log(rows[i]['price']);
                        size_list[rows[i]['size']][2].push(rows[i]['price']);
                        var price_data = size_list[rows[i]['size']][0];
                        var last = price_data[price_data.length-1];
                        var percent = (rows[i]['price'] - last) / last * 100;
                        percent = parseInt(percent*100)/100;
                        size_list[rows[i]['size']][2].push(percent);
                    }
                    res.render('graph',{title: dong_value + " " + name_value, size_list:size_list});
                } else {
                    console.log("err query")
                }
            });
            //res.render('graph',{title: dong_value + " " + name_value, price:price, date:date});
        } else {
            console.log("err graph");
        }
    });
  });
 
  module.exports = router;