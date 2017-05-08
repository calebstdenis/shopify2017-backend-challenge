const sut = require('../app/json-api-parser');

const http = require('http');
const PassThrough = require('stream').PassThrough;
const testData = require('./test-data');

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);
require('chai').should();

describe("JSON API Parsing Module", () => {
    
    describe("parseJsonApi", () => {
        let httpGetStub, resultData;

        before(() => {
            httpGetStub = sinon.stub(http, http.get.name);
            const httpResponse = new PassThrough();
            httpGetStub.yields(httpResponse);
            httpResponse.write(JSON.stringify(testData));
            httpResponse.end();

            resultData = sut.parseJsonApi("http://fakeapi.com/orders.json?page=1");
        });

        after(() => {
            httpGetStub.restore();
        });

        it("should make a GET request to the given API page", () => {
            httpGetStub.should.have.been.calledWith("http://fakeapi.com/orders.json?page=1");
        });

        it("should return a promise of the parsed JSON data", (done) => {
            resultData.should.eventually.deep.equal(testData).notify(done);
        });
    });
});