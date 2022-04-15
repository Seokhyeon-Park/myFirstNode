const https = require('https'); // https
const fs = require('fs');

https.createServer({
    /**
     * cert, key, ca를 인증기관에서 발급받은 파일을 등록해야함.
     */
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
}, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(443, () => {
    console.log('443번 포트에서 서버 대기 중입니다!');
    });