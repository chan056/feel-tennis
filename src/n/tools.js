function response404(response){
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    response.end();
}

function isEmpty(obj) {
	return (Object.getOwnPropertyNames(obj).length === 0);
}

function newClause(params) {
	// let mysql = require('mysql');

	if (!params || isEmpty(params)) {
		return '';
	}

	var qualification = '';
	var n = 0;
	var sortBy = '';
	var sortOrd = '';
	for (var i in params) {
		let k = params[i];

		// i = mysql.escape(i);
		// k = mysql.escape(k);

		if(i != 'pageNum' && i != 'pageSize'){
			if(i == 'sortBy'){
				sortBy = k;
			}else if(i == 'sortOrd'){
				sortOrd = k;
			}else{
				n == 0?
				qualification += i + '="' + k + '"':
				qualification += ' and ' + i + '="' + k + '"';
			}
		}

		n ++;
	}

	if(sortBy){
		qualification += ` order by ${sortBy}`;
	}

	if(sortOrd){
		qualification += ` ${sortOrd}`;
	}

	qualification = qualification.replace(/'/g, '');

	return qualification;
}

// 61 => 00:01:01
function formatTime(seconds){
	const m = 60;
	const h = 3600;

	let hour = Math.floor(seconds/h);
	hour = zeroFill(hour);

	seconds = seconds%h;

	let minute = Math.floor(seconds/m);
	minute = zeroFill(minute);

	seconds = seconds%m;
	seconds = zeroFill(seconds);
	// seconds = seconds.toFixed(0);

	return hour + ':' + minute + ':' + seconds;

	function zeroFill (v){
		return v < 10? '0'+v: v;
	}
}


function convertSrt2vtt(r, filename){
	const path = require('path');
	const fs = require('fs');
	
	filename = filename || 'subtitle'
    let srtPath = path.resolve(r, filename);
	let srt2vtt = require('srt-to-vtt');

    fs.exists(srtPath, function(doExist){
        if(doExist){
			let storePos = path.resolve(r, `${filename}.vtt`)

			fs.createReadStream(srtPath)
				.pipe(srt2vtt())
				.pipe(fs.createWriteStream(storePos))
        }
    })
}

function scaleImage(source, dest, imgSize, fn){
	// ffmpeg -i input.jpg -vf scale=320:-1 output_320.png 等比例
	// `ffmpeg -i ${source} -vf scale=${avatarWidth}:ih*${avatarWidth}/iw ${dest} -y 等比例

	const exec = require('child_process').exec;

	var cmd;
	imgSize = imgSize || require('./constant').videoCoverSize.split('x');

	if(imgSize.constructor === Array){
		cmd = `ffmpeg -i "${source}" -vf scale=${imgSize[0]}:${imgSize[1]} ${dest} -y`;
	}else if(imgSize.constructor === Number){
		cmd = `ffmpeg -i "${source}" -vf scale=${imgSize}:-1 ${dest} -y`;
	}

	exec(cmd, function(err){
		if(err){
			console.log(err);
		}

		fn && fn();
	});
}

function sendActiveEmail(usrId, name, email, code, req, res){
	let referer = req.headers.referer;
	if(!referer)
		return;

	let activeCode = JSON.stringify({
		id: usrId,
		code: code
	});

	let crypto = require('./crypto.js');

	let encryptedCode = crypto.aesEncrypt(activeCode, require('./constant').aesKey);

	let url = require('url');
	referer = url.parse(referer);
	let host = this.resolveRefererHost(referer);
	let emailSubject = `${host} 注册确认`;
	let linkActivePage = `${host}/emailConfirm?code=${encryptedCode}`;
	if(referer.path === '/'){// vue-router hash mode
		linkActivePage = `${host}?code=${encryptedCode}#/emailConfirm`;
	}
	let emailContent = `你好 ${name}, 
			<a href="${linkActivePage}">点击</a>激活账号
			<br/>
			如无法打开，请复制以下链接
			<br/>
			${linkActivePage}`;

	let emailer = require('./mail');
	emailer.sendMail(email, emailSubject, emailContent);
}

function copyFile(src, dest, fn){
	const fs = require('fs');

	fs.readFile(src, function(err, data){
		if(err) console.log(err)

		fs.writeFile(dest, data, fn);
	})
}

function botCheck(userAgent) {
	var botPattern = `googlebot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|
		wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|
		FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|
		webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|
		findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|
		mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|
		turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|
		findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|
		summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|
		RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|
		drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|
		coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|
		siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|
		rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|
		urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|
		ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|
		Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|
		Domain Re-Animator Bot|AddThis`;
	var re = new RegExp(botPattern, 'i');

	if (re.test(userAgent)) {
		return true;
	} else {
		return false;
	}
}

function resolveRefererHost(referer){
	return (referer.protocol || 'http') + '//' + referer.host;
}

// /albums/13 => albums._
function transformPath(pagePath){
	// /albums/13 => albums.13
	pagePath = pagePath.replace(/\//, '').replace(/\//g, '.');
	return pagePath;
	// albums.13 => albums._
	/* pagePath = pagePath.split('.').map((p)=>{
		if(p.match(/^\d+$/)){
			return '_'
		}else{
			return p
		}
	}); */

	return pagePath.join('.')
}

function spawn(processArgs, fn, res){
	let node = require('child_process').spawn('node', processArgs);

	node.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	node.stderr.on('data', (data) => {
		console.log(`node stderr: ${data}`);
	});

	node.on('close', (code) => {
		if (code !== 0) {
			let msg = `node 进程的退出码：${code}`;
			res.end(msg)
		}else{
			fn && fn();
		}
	});

	node.on('error', (err) => {
		console.log(err);
	});
}

function fetchHTML (url, fn, fnErr){
	require('request')(url, function(error,response,body) {
		if(error)
			return console.log(error);
			
		if(!error && response.statusCode == 200){
			fn && fn(body)
		}else{
			console.log( `statusCode: ${response.statusCode}`);
			fnErr()
		}
	})
}

module.exports = {
    response404,
    isEmpty,
	newClause,
	formatTime,
	convertSrt2vtt,
	scaleImage,
	sendActiveEmail,
	copyFile,
	botCheck,
	resolveRefererHost,
	transformPath,
	spawn,
	fetchHTML
}