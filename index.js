import http from 'http';

http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\n');
}).listen(1337, '127.0.0.1');