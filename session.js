const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {};

http.createServer( async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    console.log("cookies : ", cookies);
    console.log("req.url : ", req.url);

    /**
     * GET 요청 뒤는 Querystring
     * ex) www.url.com/login?name=asdf...
     */
    if(req.url.startsWith('/login')) {
        console.log("LOGIN!!");
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        
        // ** 추가 **
        const uniqueInt = Date.now();
        session[uniqueInt] = {
            name,
            expires
        };
        // *********

        // 쿠키 : session = uniqueInt
        res.writeHead(302, {
        Location: '/',
        'Set-Cookie': `session = ${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    } 
    /**
     * ** 추가(수정) **
     * cookies의 session이 존재하고, session[cookies.session(uniqueInt)]가 (세션 종료 시간이..) 지금 시간보다 큰 경우.
     * 사실 브라우저가 세션 체크를 하기 떄문에
            session[cookies.session].expires > new Date() << 이중 체크라고 생각하면 된다.
     */
    else if (cookies.session && session[cookies.session].expires > new Date()) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        // ** 추가(수정) **
        res.end(`${session[cookies.session].name}님 안녕하세요`);
    } else {
        try {
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, { 'Context-Type' : 'text/html; charset=utf-8' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Context-Type' : 'text/plain; charset=utf-8' });
            res.end(err.message);
        }
    }
})
    .listen(8080, () => {
        console.log("8080 ON");
    });

