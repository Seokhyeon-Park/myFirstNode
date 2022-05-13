const express = require("express");
const path = require("path");
const app = express();
// express는 http를 이미 import(require) 하고있음.

// port 번호를 3000으로...
app.set('port', process.env.PORT || 3000);

/**
 * [ Middleware ] : use << 미들웨어
 * 모든 코드에서 실행되는 부분
 * (*중요) next를 사용하지 않으면 미들웨어 아래 부분으로 더이상 넘어가지 않는다.
 */
app.use((req, res, next) => {
    console.log("공통 코드를 모아두자...");
    next();
}, (req, res, next) => {
    throw new Error("에러가 났어요!");
});

// 다음과 같이 조건을 줄 수 있다. : about에서만 사용하는 미들웨어.
// app.use('/about', (req, res, next) => {
//     console.log("공통 코드를 모아두자...");
//     next();
// });

// 다음과 같이 미들웨어를 여러번 거칠 수 있음
// app.use((req, res, next) => {
//     console.log("공통 코드를 모아두자...1");
//     next();
// }, (req, res, next) => {
//     console.log("공통 코드를 모아두자...2");
//     next();
// }, (req, res, next) => {
//     console.log("공통 코드를 모아두자...3");
//     next();
// });

/**
 * [ html 서빙하기 ] : 라우터, 단 (req, res) 함수는 미들웨어
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

// route parameter (:변수명), 와일드카드(:)
// 와일드카드는 맨 아래에 써야함. (여기서 걸려버릴 수 있어서...)
// 이 아래에 미들웨어는 안쓰는게 좋다.
app.get('/category/:name', (req, res) => {
    res.send(`${req.params.name}`);
});

app.listen(3000, () => {
    console.log("Express on");
});