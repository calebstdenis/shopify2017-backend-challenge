const sut = require('../app/shopify-api');
let Promise = require('es6-promise').Promise;

const sinon = require('sinon');
require('chai').should();

// Test data
const dataPage1 = {
        available_cookies: 6,
        orders: [
            {id: "fakeorder1"}
        ],
        pagination: {
            current_page: 1,
            per_page: 5,
            total: 11
        }
    };
const dataPage2 = {
    available_cookies: 6,
    orders: [
        {id: "fakeorder2"}
    ],
    pagination: {
        current_page: 2,
        per_page: 5,
        total: 11,
    }
};
const dataPage3 = {
    available_cookies: 6,
    orders: [
        {id: "fakeorder3"}
    ],
    pagination: {
        current_page: 3,
        per_page: 5,
        total: 11,
    }
};

describe("Shopify Paginated API Handling Module", () => {
    describe("parsePaginatedOrders", () => {
        const shopUrl = "https://backend-challenge-fall-2017.herokuapp.com";
        let jsonApiParserStub, result;

        before(() => {
            jsonApiParserStub = sinon.stub();
            jsonApiParserStub.withArgs(`${shopUrl}/orders.json?page=1`).returns(Promise.resolve(dataPage1));
            jsonApiParserStub.withArgs(`${shopUrl}/orders.json?page=2`).returns(Promise.resolve(dataPage2));
            jsonApiParserStub.withArgs(`${shopUrl}/orders.json?page=3`).returns(Promise.resolve(dataPage3));
            jsonApiParserStub.returns(Promise.resolve(0));

            result = sut.parsePaginatedOrders(jsonApiParserStub, shopUrl);
        });

        it("should resolve a promise containing a consolidated list of orders from the paginated API", () => {
            return result.should.eventually.have.property("orders").to.deep.equal([...dataPage1.orders, ...dataPage2.orders, ...dataPage3.orders]);
        });
        it("should resolve a promise containing data shared by all orders", () => {
            return result.should.eventually.have.property("available_cookies", 6);
        });
        it("should strip pagination data", () => {
            result.should.not.eventually.have.property("pagination");
        });
    });
});