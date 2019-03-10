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
const conn = require('../db/connect.js');

const appid = '20190131000260936',
	key = 'izgNbY0Pklgocd8naHK0',
	from = 'en',
	salt = '1435660288';

// 从英文转换成各种语言
function translate(sourceStr, to = 'zh', fn) {
	// 检查是否存在数据库中
	conn.query(`select * from tennis.translation where en='${escape(sourceStr)}'`, function (err, result, fields) {
		if (err)
			throw err;
		
		if (result && result[0]) {
			let row = result[0];
			fn && fn(unescape(row[to]))
		} else {
			requestTranslation(saveTranslation);
		}
	})

	function requestTranslation() {
		let sign = crypto.md5(appid + sourceStr + salt + key);
		// console.log(sign)
		let url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(sourceStr)}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;

		http.get(url, function (res) {
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					let translation = '';
					
					if(parsedData.trans_result){
						translation = parsedData.trans_result[0].dst;
					}

					fn && fn(translation);

					saveTranslation(sourceStr, translation)
				} catch (e) {
					console.error(e.message);
				}
			});
		})
	}

	function saveTranslation(en, dst){
		conn.query(`insert into tennis.translation values (null, '${escape(en)}', '${escape(dst)}')`, function (err, result, fields){
			if(err)
				throw err
		})
	}
}

module.exports = translate;

// tranlate('One of the greatest players ever to pick up a racquet, Novak Djokovic won his first Grand Slam title at the 2008 Australian Open, defeating Jo-Wilfried Tsonga in four sets in the final. The Serb won his first Wimbledon and first U.S. Open in 2011, and in 2016 he completed the career Grand Slam by ousting Andy Murray in the Roland Garros final. With that title, Djokovic held all four Grand Slams at once, and he had a 30-match Grand Slam winning streak until Sam Querrey beat him in the third round of Wimbledon in 2016. Djokovic, who reached No. 1 in the world for the first time on July 4, 2011, is known for his remarkable all-court play, aggressive baseline skills, tremendous stamina and unparalleled consistency. He is a terrific defensive player and one of the fittest men on tour, and he’s developed a very dangerous serve over the years. ___Hi.')

/*
  1. 返回原文
  2. 根据class收集翻译的文字，用特殊符号间隔
  3. 得到译文后 根据index 替换

  减少请求数据
    存储翻译结果 匹配后直接返回

  优势：
    响应较快
    根据用户需要切换不同的语言

  劣势
    用户等待译文得1s左右
*/