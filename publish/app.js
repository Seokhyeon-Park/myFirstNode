const express = require("express");
const path = require("path");
const app = express();
// express는 http를 이미 import(require) 하고있음.

// port 번호를 3000으로...
app.set('port', process.env.PORT || 3000);

/**
 * [ Middleware ]
 * 모든 코드에서 실행되는 부분
 * (*중요) next를 사용하지 않으면 미들웨어 아래 부분으로 더이상 넘어가지 않는다.
 */
app.use((req, res, next) => {
    console.log("공통 코드를 모아두자...");
    next();
});

/**
 * [ html 서빙하기 ]
 * get ('/') 요청을 받는 경우,
 * 현재 directory에 있는 'index.html' 파일을 전송.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.post('/', (req, res) => {
    console.log("post 예시")
});

app.get('/about', (req, res) => {
    res.send('about!!');
});

app.listen(3000, () => {
    console.log("Express on");
});