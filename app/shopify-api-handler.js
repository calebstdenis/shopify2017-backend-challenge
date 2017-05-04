let http = require('http');
let R = require('ramda');

module.exports = {
parsePaginatedJSON: function(endpoint) {
    // R.range(1, getLastPage(endpoint))
    // .map(parseApiPage(endpoint))
    // .all();
},
getLastPage: function(endpoint) { },

parseApiPage: R.curry(function(endpoint, pageNum) {
    // let parsedData;
    // http.get(`${endpoint}?page=${pageNum}`, (res) => {
    //     let rawData;
    //     res.on('data', (chunk) => rawData += chunk);
    //     res.on('end', () => {
    //         try {
    //             parsedData = JSON.parse(rawData);
    //         } catch(e) {
    //             console.error(e.message);
    //         }
    //     });
    // });
}),
} 