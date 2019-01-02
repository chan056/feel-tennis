const { exec } = require('child_process');

constant ONEHOURMILLISECOND = 60 * 60 * 1000;

setInterval(function(){
    // 每天早上4点
    if(new Date().getHours() !== 4)
        return;

    exec('git fetch --dry-run', (error, stdout, stderr) => {
        if (error) {
            return console.error(error);
        }
    
        if(stdout){
            console.log('有改动')
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

                    exec('netstat -aon|findstr 3000', (error, stdout, stderr) => {
                        if (error) {
                            return npmStart();
                        }

                        const reg = /\s(\d+)\s/;
                        let PID = stdout.match(reg);

                        if(PID){
                            PID = PID[1];
        
                            exec(`taskkill /pid ${PID} -t -f`,(error, stdout, stderr)=>{
                                if (error) {
                                    return console.error(error);
                                }
                                console.log('关闭旧服务')

                                npmStart()
                            })
                        }else{
                            npmStart()
                        }
                    })
                })
            })
        }else{
            console.log('已是最新，无需更新')
        }
    });

    function npmStart(){
        console.log('已重启')

        exec('npm start', (error, stdout, stderr) => {
            if (error) {
                return console.error(error);
            }
        })
    }
}, ONEHOURMILLISECOND)
