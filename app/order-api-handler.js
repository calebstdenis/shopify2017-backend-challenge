let http = require('http');
let R = require('ramda');
let Promise = require('es6-promise').Promise;

module.exports = {
parsePaginatedOrders: function(endpoint) {
    // R.range(1, getLastPage(endpoint))
    // .map(getJSON(endpoint))
    // .all();
},
getLastPage: function(endpoint) { },


getJSONFromPage: R.curry(function(endpoint, pageNum) {
    return new Promise(function(resolve, reject) {
        http.get(`${endpoint}?page=${pageNum}`, (res) => {
            let rawData = "";
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    let result = JSON.parse(rawData)
                    resolve(result);
                }
                catch(e) {
                    reject(e);
                }
            });
        });
    })
}),
} 