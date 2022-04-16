const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

// 마스터 프로세스면...
if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    // CPU 개수만큼 워커를 생산
    console.log("numCPUs : ", numCPUs);
    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }
    // 워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log("======================");
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code', code, 'signal', signal);
        console.log("======================");
        /**
         * 워커 재생성
         * 하단 코드 주석 처리시 : 총 코어수 만큼 요청이 들어오는 경우 모든 프로세스가 꺼지게 된다.
         * 하단 코드 주석 해제시 : 프로세스를 종료하여도 계속 워커를 생성하기 때문에 계속 동작한다.
         */
        // cluster.fork();
    });
}
// 마스터 프로세서가 아니면...
else {
  /**
   * [요청이 들어온 경우]
   * 워커들이 포트에서 대기
   */
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Cluster!</p>');
    /**
     * 요청이 들어오면 response를 보낸 후 종료
     * (워커 존재를 확인하기 위해 1초마다 강제 종료)
     */
    setTimeout(() => {
        process.exit(1);
    }, 1000);
    })
        // listen...
        .listen(8080);
        console.log(`${process.pid}번 워커 실행`);
}