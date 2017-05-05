let http = require('http');
let R = require('ramda');
let Promise = require('es6-promise').Promise;

module.exports = {
parsePaginatedOrders: function(endpoint) {
    let promisedData = this.getLastPage(endpoint).then(lastPage => {
        R.range(1, lastPage)
        .map(this.getJSONFromPage(endpoint));
    });
    return Promise.all(promisedData).then(this.consolidatePagedData);
},

consolidatePagedOrders: function(pages) {
    let allOrders = pages.map(page => page.orders)
    let consolidatedData = Object.assign({}, pages[0], { orders: [].concat(allOrders) });
    delete consolidatedData.pagination;
    return consolidatedData;
},

getLastPage: function(endpoint) {
    return this.getJSONFromPage(endpoint)(1000000000).then(result => result.pagination.total)
},

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