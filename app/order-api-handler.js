let http = require('http');
let R = require('ramda');
let Promise = require('es6-promise').Promise;

exports.parsePaginatedOrders = async function(endpoint) {
    const lastPage = await this.getLastPage(endpoint);
    const promisedApiPages = 
        R.range(1, lastPage+1)
        .map(this.getJSONFromPage(endpoint));

    return Promise.all(promisedApiPages).then(this.consolidatePagedOrders);
};

exports.getLastPage = function(endpoint) {
    return this.getJSONFromPage(endpoint)(1000000000).then(result => result.pagination.total);
};

exports.getJSONFromPage = R.curry(function(endpoint, pageNum) {
    return new Promise(function(resolve, reject) {
        http.get(`${endpoint}?page=${pageNum}`, (res) => {
            let rawData = "";
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    let result = JSON.parse(rawData);
                    resolve(result);
                }
                catch(e) {
                    reject(e);
                }
            });
        });
    });
});

exports.consolidatePagedOrders = function(pages) {
    let ordersByPage = pages.map(page => page.orders);
    let consolidatedData = Object.assign(
        {}, 
        pages[0], 
        { orders: [].concat(...ordersByPage) }
    );
    delete consolidatedData.pagination;
    return consolidatedData;
};