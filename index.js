import http from 'http';
import parsePagedApi from './app/shopify-api-handler'

http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(parsePagedApi());
}).listen(1337, '127.0.0.1');