
const mariadb = require('./maria');

function getMaxPage(dong_value, search_value) {
    return new Promise((resolve,reject) => {
        search_value = '%' + search_value + '%';
        if (dong_value=="any") {
            mariadb.query("SELECT COUNT(DISTINCT street_adress, dong, name) FROM apart_price_clone WHERE name LIKE ?",[search_value], function(err, num, fields) {
                if (!err) {
                    total_page=Math.floor(num[0]['COUNT(DISTINCT street_adress, dong, name)']/20)+1;
                    if (total_page>10) {total_page=10;}
                    resolve(total_page);
                } else {
                    reject();
                }
            });
        } else {
            mariadb.query("SELECT COUNT(DISTINCT street_adress, dong, name) FROM apart_price_clone WHERE dong=? AND name LIKE ?",[dong_value, search_value], function(err, num, fields) {
                if (!err) {
                    total_page=Math.floor(num[0]['COUNT(DISTINCT street_adress, dong, name)']/20)+1;
                    if (total_page>10) {total_page=10;}
                    resolve(total_page);
                }
                else {
                    reject();
                }
            });
        }
    });
}

function getPrices(dong_value, search_value, curr_page) {
    return new Promise((resolve, reject) => {
        search_value = '%' + search_value + '%';
        var start_index=(parseInt(curr_page)-1) * 20;
        if (dong_value=="any") {
            mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE name LIKE ? ORDER BY name LIMIT 20 OFFSET ?",[search_value, start_index], function(err, rows, fields) {
                if (!err) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            });  
        } else {
            mariadb.query("SELECT DISTINCT street_adress, dong, name FROM apart_price_clone WHERE dong=? AND name LIKE ? ORDER BY name LIMIT 20 OFFSET ?",[dong_value, search_value, start_index], function(err, rows, fields) {
                if (!err) {
                    resolve(rows);
                } else {
                    reject();
                }
            });      
        }
    });
}
module.exports={
    getMaxPage,
    getPrices
}