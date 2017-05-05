module.exports = {
    calculateUnfulfilledCookieOrders: function() {

    },
    orderHasCookies: order => !!order.products.find(product => product.title === "Cookie") 
}