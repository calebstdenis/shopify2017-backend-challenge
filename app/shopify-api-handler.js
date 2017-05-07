let http = require('http');
let R = require('ramda');
let Promise = require('es6-promise').Promise;

exports.parsePaginatedOrders = function(shopUrl) {
    let pageParser = this.getJSONFromPage(shopUrl + '/orders.json');
    return this.parsePages(pageParser).then(this.consolidatePagedOrders);
};

exports.consolidatePagedOrders = function(pages) {
    let pagesOfOrders = pages.map(page => page.orders);
    let consolidatedData = Object.assign({}, 
        pages[0], 
        { orders: [].concat(...pagesOfOrders) }
    );
    delete consolidatedData.pagination;
    return consolidatedData;
};

exports.parsePages = async function (parsePage, accumulatedPages, currentPageNum) {
    accumulatedPages = accumulatedPages || [];
    currentPageNum = currentPageNum || 1;

    let page = await parsePage(currentPageNum);

    accumulatedPages.push(page);

    if(this.isLast(page)) {
        return accumulatedPages;
    }
    else {
        return this.parsePages(parsePage, accumulatedPages, currentPageNum+1);
    }
};

exports.isLast = function(page) {
    let pagination = page.pagination;
    return pagination.current_page * pagination.per_page >= pagination.total;
};

exports.parsePage = R.curry(function(endpoint, pageNum) {
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
