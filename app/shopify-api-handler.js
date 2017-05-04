import http from 'http';
import R from 'rambda';

export const parsePaginatedJSON = function(endpoint) {
    // R.range(1, getLastPage(endpoint))
    // .map(parseApiPage(endpoint))
    // .all();
};

let getLastPage = function(endpoint) { };

let parseApiPage = R.curry(function(endpoint, pageNum) {
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
});