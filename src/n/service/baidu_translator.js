// http://api.fanyi.baidu.com/api/trans/product/desktop

// http://api.fanyi.baidu.com/api/trans/vip/translate?q=Novak Djokovic&from=en&to=zh&appid=20190131000260936&salt=1435660288&sign=24275eccf8298c77525d85c43b482d05


// APP ID: 20190131000260936
// 密钥: izgNbY0Pklgocd8naHK0

// q	                       Novak Djokovic
// from	                   en
// to                         zh
// appid                      20190131000260936
// salt                       1435660288
// sign	                   appid+q+salt+密钥 的MD5值 20190131000260936Novak Djokovic1435660288izgNbY0Pklgocd8naHK0 f7a654e845a0dea40b8309a7c5121bb6

const http = require('http');
const crypto = require('../crypto.js');

const appid = '20190131000260936',
    key = 'izgNbY0Pklgocd8naHK0',
    from = 'en',
    to = 'zh',
    salt = '1435660288';

function tranlate(sourceStr){
    let sign = crypto.md5(appid + sourceStr + salt + key);
    console.log(sign)
    let url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(sourceStr)}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;

    http.get(url, function(res){
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData.trans_result[0].dst);
          } catch (e) {
            console.error(e.message);
          }
        });
    })
}

module.exports = tranlate;

tranlate('Taylor Fritz')