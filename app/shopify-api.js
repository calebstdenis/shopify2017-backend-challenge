exports.parsePaginatedOrders = function(jsonParser, shopUrl) {
    let pageParser = (pageNum) => jsonParser(`${shopUrl}/orders.json?page=${pageNum}`);
    return parsePages(pageParser).then(consolidatePagedOrders);
};

let parsePages = async function(parsePage, accumulatedPages, currentPageNum) {
    accumulatedPages = accumulatedPages || [];
    currentPageNum = currentPageNum || 1;

    let page = await parsePage(currentPageNum);

    accumulatedPages.push(page);

    if(isLast(page)) {
        return accumulatedPages;
    }
    else {
        return parsePages(parsePage, accumulatedPages, currentPageNum+1);
    }
};

let isLast = function(page) {
    let pagination = page.pagination;
    return pagination.current_page * pagination.per_page >= pagination.total;
};

let consolidatePagedOrders = function(pages) {
    let pagesOfOrders = pages.map(page => page.orders);
    let consolidatedData = Object.assign({}, 
        pages[0], 
        { orders: [].concat(...pagesOfOrders) }
    );
    delete consolidatedData.pagination;
    return consolidatedData;
};

