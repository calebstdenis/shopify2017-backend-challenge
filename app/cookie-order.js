let R = require('ramda');

exports.calculateUnfulfillableCookieOrders = function(orderData) {
    return R.pipe(
        () => orderData.orders,
        R.filter(hasCookies),
        R.sortWith([ // https://github.com/ramda/ramda/commit/98908f92289dabd797770aca6c64bae1a96b0a9c
            R.descend(numberOfCookies),
            R.ascend(R.prop("id"))
        ]),
        R.reduce(toUnfulfillableOrders, { // This is probably abuse of the "reduce" function.
            remaining_cookies: orderData.available_cookies,
            unfulfilled_orders: []
        }),
        R.evolve({
            unfulfilled_orders: R.pipe(
                R.sortBy(R.prop('id')),
                R.pluck('id')
            )
        })
    )();
};

let productIsCookie = product => product.title === "Cookie";

let hasCookies = order => order.products.some(productIsCookie); 

let numberOfCookies = order => order.products.find(productIsCookie).amount;

let toUnfulfillableOrders = function(acc, val) {
    let cookiesInOrder = numberOfCookies(val);

    if(cookiesInOrder > acc.remaining_cookies) {
        acc.unfulfilled_orders.push(val);
    }
    else {
        acc.remaining_cookies -= cookiesInOrder;
    }
    return acc;
};