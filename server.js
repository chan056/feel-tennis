
const http = require('http');
const https = require('https');
const fs = require('fs');

let PORT = 80;
let isTesting = false;

let argv = process.argv;
if(argv[0] == '/usr/local/bin/node' || argv[0] == 'E:\\soft\\node\\node.exe'){
    isTesting = true;
    PORT = 3000;
}
global.staticRoot = __dirname + '/src/static';

let serverConfig = require('./src/n/db/serverConfig');

let server = http.createServer(function(req, res){
    res.writeHead(301, {'Location': isTesting? 'https://localhost':'https://www.yitube.cn/'});
    res.end();
}).listen(PORT, function(){
    console.log('HTTP listen on ' + PORT)
});

let sslOption = {
    key: fs.readFileSync('./1533833923829.key'),
    cert: fs.readFileSync('./1533833923829.pem')
}

https.createServer(sslOption, serverConfig).listen(443, function(){
    console.log('HTTPS listen on ' + 443)
});
// process.on('uncaughtException',function(err){
//     console.log(err);
//     return false;
// }) //监听未捕获的异常
