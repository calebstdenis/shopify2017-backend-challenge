let parseJson = require('./json-parse').parseJsonApi;
let parsePaginatedOrders = require('./shopify-api').parsePaginatedOrders;
let calculateUnfulfillableCookieOrders = require('./cookie-order').calculateUnfulfillableCookieOrders;

exports.getUnfulfillableOrders = function() {
    return parsePaginatedOrders(parseJson, 'http://backend-challenge-fall-2017.herokuapp.com').then(calculateUnfulfillableCookieOrders);
};