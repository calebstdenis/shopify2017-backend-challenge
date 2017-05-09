const sut = require('../app/cookie-order');

describe("Cookie Order Calulation Module", () => {
    describe("calculateUnfulfillableCookieOrders", () => {

        it("should automatically fulfill all orders without cookies", () => {
            const data = {
                available_cookies: 0,
                orders: [
                    {
                        id: 1,
                        products: [
                            {
                                title: "Apple Pie",
                                amount: 1,
                                unit_price: 1
                            }
                        ]
                    },
                    {
                        id: 2,
                        products: [
                            {
                                title: "Cookie",
                                amount: 1,
                                unit_price: 1
                            }
                        ]
                    }
                ]
            };
            let result = sut.calculateUnfulfillableCookieOrders(data);
            
            result.unfulfilled_orders.should.have.members([2]);
        });

        it("should prioritize fulfillment of orders with the highest amount of cookies", () => {
            const data = {
                available_cookies: 2,
                orders: [
                    {
                        id: 1,
                        products: [
                            {
                                title: "Cookie",
                                amount: 1,
                                unit_price: 1
                            }
                        ]
                    },
                    {
                        id: 2,
                        products: [
                            {
                                title: "Cookie",
                                amount: 2,
                                unit_price: 1
                            }
                        ]
                    }
                ]
            };
            let result = sut.calculateUnfulfillableCookieOrders(data);
            
            result.unfulfilled_orders.should.have.members([1]);
        });

        it("if two orders have the same number of cookies, it should prioritize the one with the lowest ID", () => {
            const data = {
                available_cookies: 1,
                orders: [
                    {
                        id: 1,
                        products: [
                            {
                                title: "Cookie",
                                amount: 1,
                                unit_price: 1
                            }
                        ]
                    },
                    {
                        id: 2,
                        products: [
                            {
                                title: "Cookie",
                                amount: 1,
                                unit_price: 1
                            }
                        ]
                    }
                ]
            };
            let result = sut.calculateUnfulfillableCookieOrders(data);
            
            result.unfulfilled_orders.should.have.members([2]);
        });

        it("should skip higher-priority orders that have an amount of cookies bigger than the remaining cookies", () => {
            const data = {
                available_cookies: 5,
                orders: [
                    {
                        id: 1,
                        products: [
                            {
                                title: "Cookie",
                                amount: 4,
                                unit_price: 1
                            }
                        ]
                    },
                    {
                        id: 2,
                        products: [
                            {
                                title: "Cookie",
                                amount: 3, //should be skipped
                                unit_price: 1
                            }
                        ]
                    },
                    {
                        id: 3,
                        products: [
                            {
                                title: "Cookie",
                                amount: 1,
                                unit_price: 1
                            }
                        ]
                    }
                ]
            };
            let result = sut.calculateUnfulfillableCookieOrders(data);
            
            result.unfulfilled_orders.should.have.members([2]);
        });
    });
});