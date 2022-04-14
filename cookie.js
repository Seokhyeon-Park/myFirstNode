const http = require('http');

http.createServer((req, res) => {
    console.log('req url : ', req.url);
    console.log('req.headers.cookie : ', req.headers.cookie);
    // 응답으로 헤더에 Set-Cookie 하여 전송 (myCookie = seokbong을 담아서...)
    res.writeHead(200, { 'Set-Cookie' : 'myCookie=seokbong' });
    res.end('Cookie Test');
})
    .listen(8080, () => {
        console.log("8080 PORT ON");
    });