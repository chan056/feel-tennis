const { exec } = require('child_process');
const ONEHOURMILLISECOND = 60 * 60 * 1000;

setInterval(function(){
    // 每天早上4点多
    if(new Date().getHours() !== 4)
        return;

    exec('git fetch --dry-run', (error, stdout, stderr) => {
        if (error) {
            return console.error(error);
        }
    
        if(1){
            console.log('有改动: ' + new Date())
            exec('git pull', (error, stdout, stderr) => {
                if (error) {
                    return console.error(error);
                }
                console.log('拉取')

                exec('webpack', (error, stdout, stderr) => {
                    if (error) {
                        return console.error(error);
                    }

                    console.log('打包')
                    
                    exec('forever restart server.js', (error, stdout, stderr) => {
                        if (error) {
                            return console.error(error);
                        }

                        console.log('重启')
                    })
                })
            })
        }else{
            console.log('已是最新，无需更新 ' + new Date())
        }
    });
}, ONEHOURMILLISECOND)
