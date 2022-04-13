const http = require('http');

http.createServer((req, res) => {
    console.log('req url : ', req.url);
    console.log('req.headers.cookie : ', req.headers.cookie);
    res.writeHead(200, { 'Set-Cookie' : 'myCookie=seokbong' });
    res.end('Hello Cookie');
})
    .listen(8080, () => {
        console.log("8080 PORT ON");
    });