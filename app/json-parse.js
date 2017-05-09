let Promise = require('es6-promise').Promise;
let http = require('http');

exports.parseJsonApi = function(requestUrl) {
    return new Promise(function(resolve, reject) {
        http.get(requestUrl, (res) => {
            let rawData = "";
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    let result = JSON.parse(rawData);
                    resolve(result);
                }
                catch(e) {
                    reject(e);
                }
            });
        });
    });
};
