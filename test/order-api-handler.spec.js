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
    let httpGetStub;

    beforeEach(() => {
        httpGetStub = sinon.stub(http, "get");
    });
    
    describe("getJSON", () => {
        before(() => {
            const response = new PassThrough();
            httpGetStub.callsArgWith(1, response);
            response.write(JSON.stringify(testData));
            response.end();
        });

        it("should make a GET request to the given API page", () => {
            httpGetStub.should.have.been.calledWith("http://fakeapi.com/orders.json?page=1");
        });

        it("should return a promise of the parsed JSON data", (done) => {
             sut.getJSONFromPage("http://fakeapi.com/orders.json")(1).should.eventually.deep.equal(testData).notify(done);
        });
    });

    describe("getLastPage", () => {
        it("should make a GET request to an arbitrary non-valid page to get just the pagination data", () => {

        });
        it("should return the number of pages based on the response pagination data", () => {

        });
    });

    describe("parsePaginatedJSON", () => {
        it("should consolidate paged JSON into a single array of orders", () => {

        });
        
        it("should strip pagination data", () => {

        });

        it("should considate shared data among pages (shared cookies)", () => {

        });
    });
});