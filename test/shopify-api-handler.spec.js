const http = require('http');
const PassThrough = require('stream').PassThrough;
const testData = require ('./test-data');
const sut = require('../app/shopify-api-handler')

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('chai').should();

describe("Shopify Paginated API Handler", () => {
    let httpGetStub;

    beforeEach(() => {
        httpGetStub = sinon.stub(http, "get");
    });
    
    describe("getJSON", () => {
        it("should make a GET call to the given endpoint and return a promise of the parsed JSON data", (done) => {
            const response = new PassThrough();
            httpGetStub.callsArgWith(1, response);
            let test = JSON.stringify(testData)
            response.write(test);
            response.end();

            sut.getJSONFromPage("fakeEndpoint")(1).should.eventually.deep.equal(testData).notify(done);
        });
    })
});