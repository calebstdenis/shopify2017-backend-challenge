const http = require('http');
const PassThrough = require('stream').PassThrough;
const testData = require ('./test-data');
const sut = require('../app/order-api-handler')

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);
require('chai').should();

describe("Shopify Paginated API Handler", () => {
    let httpGetStub = sinon.stub(http, "get");

    after(() => {
        httpGetStub.reset();
    });
    
    describe("getJSON", () => {
        let result;

        before(() => {
            httpResponse = new PassThrough();
            httpGetStub.callsArgWith(1, httpResponse);
            httpResponse.write(JSON.stringify(testData));
            httpResponse.end();

            result = sut.getJSONFromPage("http://fakeapi.com/orders.json")(1)
        });

        it("should make a GET request to the given API page", () => {
            httpGetStub.should.have.been.calledWith("http://fakeapi.com/orders.json?page=1");
        });

        it("should return a promise of the parsed JSON data", (done) => {
            result.should.eventually.deep.equal(testData).notify(done);
        });
    });

    describe("getLastPage", () => {
        let result;

        before(() => {
            const responseData = Object.assign({}, testData); 
            responseData.orders = [];
            responseData.pagination.total = 10;

            httpResponse = new PassThrough();
            httpGetStub.callsArgWith(1, httpResponse);
            httpResponse.write(JSON.stringify(responseData));
            httpResponse.end();

            result = sut.getLastPage("http://fakeapi.com/orders.json")
        });
        
        it("should make a GET request to an arbitrary non-valid page (#1,000,000,000) to get just the pagination data", () => {
            httpGetStub.should.have.been.calledWith("http://fakeapi.com/orders.json?page=1000000000");
        });

        it("should return a promise of the number of pages based on the response pagination data", (done) => {
            result.should.eventually.equal(10).notify(done);
        });
    });

    describe("consolidatePagedOrders", () => {
        const fakeOrdersPage1 = [{id: "fakeorder1"}]
            , fakeOrdersPage2 = [{id: "fakeorder2"}];
        let result;

        before(() => {
            const dataPage1 = Object.assign({}, testData, { orders: fakeOrdersPage1 })
            , dataPage2 = Object.assign({}, testData, { orders: fakeOrdersPage2 });

            result = sut.consolidatePagedOrders([dataPage1, dataPage2]);
        });

        it("should merge orders from multiple different pages", () => {
            result.orders.should.include.members([fakeOrdersPage1, fakeOrdersPage2]);
        });
        
        it("should strip pagination data", () => {
            result.should.not.have.property("pagination");
        });

        it("should also return the data shared among pages", () => {
            result.should.have.property("available_cookies", testData["available_cookies"]);
        });
    })

    describe("parsePaginatedJSON", () => {
        let result;

        const fakeOrdersPage1 = [{id: "fakeorder1"}]
        , fakeOrdersPage2 = [{id: "fakeorder2"}];

        before(() => {
            const dataPage1 = Object.assign({}, testData, {orders: fakeOrdersPage1})
            , dataPage2 = Object.assign({}, testData, {orders: fakeOrdersPage2})
            , dataPageBillion = Object.assign({}, testData)
            dataPageBillion.pagination.total = 2;

            const responsePage1 = new PassThrough()
            , responsePage2 = new PassThrough()
            , responsePageBillion = new PassThrough();

            httpGetStub.withArgs(sinon.match.string, 1).callsArgWith(1, responsePage1);
            httpGetStub.withArgs(sinon.match.string, 2).callsArgWith(1, responsePage2);
            httpGetStub.withArgs(sinon.match.string, 1000000000).callsArgWith(1, responsePageBillion);

            responsePage1.write(JSON.stringify(dataPage1));
            responsePage2.write(JSON.stringify(dataPage2));
            responsePageBillion.write(JSON.stringify(dataPageBillion));
            
            result = sut.parsePaginatedOrders("http://fakeapi.com/orders.json");
        })

        it("should return promise with the consolidated data from the paginated API", () => {
            let expectedOrders = fakeOrdersPage1.concat(fakeOrdersPage2);
            result.should.eventually.have.members(expectedOrders);
            result.should.eventually.have.property("available_cookies", testData["available_cookies"]);
        });
    });
});