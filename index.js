let http = require ('http');
let parsePagedApi = require('./app/order-api-handler');

http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end("hello world2");
    //response.end(parsePagedApi());
}).listen(1337, '127.0.0.1');