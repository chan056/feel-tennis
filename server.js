
const http = require('http');
const fs = require('fs');

let PORT = 80;
let isTesting = false;

let argv = process.argv;
if(argv[0] == '/usr/local/bin/node' || argv[0] == 'E:\\soft\\node\\node.exe' || argv[0] == 'D:\\soft_dev\\node\\node.exe'){
    isTesting = true;
    PORT = 3000;
}
global.staticRoot = __dirname + '/src/static';

let serverConfig = require('./src/n/db/serverConfig');

let server = http.createServer(function(req, res){
    if(isTesting){
        try{
            serverConfig(req, res)
        }catch(e){
            logError(req, res, e);
        }
    }else{
        res.writeHead(301, {'Location': 'https://www.yitube.cn/'});
        res.end();
    }
}).listen(PORT, function(){
    console.log('HTTP listen on ' + PORT)
});

let sslOption = {
    key: fs.readFileSync('./1533833923829.key'),
    cert: fs.readFileSync('./1533833923829.pem')
}

if(!isTesting){
    let https = require('https');

    https.createServer(sslOption, function(req, res){
        try{
            serverConfig(req, res)
        }catch(e){
            logError(req, res, e);
        }
    }).listen(443, function(){
        console.log('HTTPS listen on ' + 443)
    });
}

function logError(req, res, err){
    console.log(err);

    return res.end(`
        <pre>
            Error  ${new Date().toISOString()} ${req.url}
            ${err.stack || err.message || 'unknow error'}
        </pre>
    `)
}

// process.on('uncaughtException',function(err){
//     console.log(err);
//     return false;
// }) //监听未捕获的异常
