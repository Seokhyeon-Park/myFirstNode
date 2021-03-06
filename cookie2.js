const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

/**
 * reduce : { } (object 형식으로 담음)
 * '=' 로 split, key : value 로 object화 return
 * ex) myCookie=seokbong -> { myCookie: 'seokbong' }
 * decodeURIComponent : Uniform Resource Identifier(URI) 컴포넌트를 Decoding
 * @param {*} cookie 
 * @returns 
 */
const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [key, value]) => {
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
    }, {});

http.createServer( async (req, res) => {
    /**
     * req의 header 내부 cookie 가져와서 전처리.
     * req.headers.cookie :  myCookie=seokbong
     * req.headers.cookie Type :  string
     * parseCookies :  { myCookie: 'seokbong' }
     */
    const cookies = parseCookies(req.headers.cookie);
    /*
     * 만약 url이 /login으로 시작하는 경우.
     * GET 요청 뒤는 Querystring
     * cookie2.html : <form action="/login"> ...
     * ex) www.url.com/login?name=asdf...
     */
    if(req.url.startsWith('/login')) {
        console.log("LOGIN!!");
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        console.log("query : ", query);
        console.log("name : ", name);
        console.log("expires : ", expires);

        // const newQuery = new URL(req.url, `http://${req.headers.host}/`);
        // const newName = newQuery.search.split('?')[1].split('=')[1];
        // console.log("newQuery : ", newQuery);
        // console.log("newName : ", newName);

        /**
         * 쿠키 유효 시간을 현재시간 + 5분으로 설정
         * 쿠키 만료시간만 잘 세팅해 주어도 브라우저가 알아서 세션 이후 쿠키를 보내지 않음.
         */
        expires.setMinutes(expires.getMinutes() + 5);

        /**
         * 302 (redirection) : 이 주소로 다시 돌려보내라. (to Location, 로그인 됐으니까...?)
         * encodeURIComponent : 한글로 보내면 쿠키가 이상한 글자로 인식함. (인코딩...)
         * Expires 설정 : 쿠키에 만료기간을 설정하지 않는 경우, 세션 쿠키가 되어버린다. (브라우저를 닫을 떄까지...)
         *      (Expires 대신 Max-age로 시간을 지정해 줄 수 있다.)
         * HttpOnly : js에서 쿠키를 건들지 못하게 설정 (특히 보안을 위해)
         * Path : 지정한 path (여기서는 '/') 내에서는 쿠키가 유효함을 나타냄
         * 위 옵션들은 개발자 도구에 [Application] 탭에서 확인이 가능하다.
         */
        res.writeHead(302, {
        Location: '/',
        'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    }
    // 쿠키가 있는 경우.
    else if (cookies.name) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요`);
    } else {
        /**
         * 그 외.
         * cookie2.html 불러오기.
         */
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

