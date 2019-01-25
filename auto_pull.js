const { exec } = require('child_process');
const crypto = require('./src/n/crypto.js');

const constants = require('./src/n/constant');
const ONEHOURMILLISECOND = 60 * 60 * 1000;

setInterval(function(){
    // 每天早上4点多
    if(new Date().getHours() !== 4)
        return;

    exec('git remote update', (error, stdout, stderr) => {
        if (error) {
            return console.error(error);
        }
    
        exec('git status -uno', (error, stdout)=>{
            if (error) {
                return console.error(error);
            }
    
            if(stdout.match('can be fast-forwarded')){
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
    
                    updateSQL();
                    updateNodeModule();
                })
            }else{
                console.log('已是最新，无需更新 ' + new Date())
            }
        })
    
    });
}, ONEHOURMILLISECOND)

function updateSQL(){
    const fs = require('fs');
    
    const databaseConfig = {
        athlete_tennis: 'update_athlete_tennis.sql',
        n: 'update.sql'
    };

    for(let databaseName in databaseConfig){
        sqlFilename = databaseConfig[databaseName];

        updateOneDatabase(sqlFilename, databaseName)
    }

    function updateOneDatabase(sqlFilename, databaseName){
        let updateSQqlPath = require('path').resolve(__dirname, sqlFilename);
    
        fs.readFile(updateSQqlPath, function(err, data){
            if(err){
                return console.log(err)
            }

            if(data.toString().length){

                fs.stat(updateSQqlPath, function(){
                    let lastUpdateTime = arguments[1].mtimeMs;
                    let now = +new Date();
                    const day = 24 * 60 * 60 * 1000;

                    if(now - lastUpdateTime < day){
                        let x = crypto.aesDecrypt(constants.encyotedPsw, constants.aesKey);

                        exec(`mysql -u root -p${x} -D${databaseName}< ${updateSQqlPath}`, function(err, stdeout, stderr){
                            if(err)
                                return console.log(err);
                    
                        });
                    }
                });
            }
        })
    }
}

function updateNodeModule(){
    fs.stat('./package.json', function(){
        let lastUpdateTime = arguments[1].mtimeMs;
        let now = +new Date();
        const day = 24 * 60 * 60 * 1000;

        if(now - lastUpdateTime < day){
            exec(`npm install`, function(err, stdeout, stderr){
                if(err)
                    return console.log(err);
        
            });
        }
    });
}