function response404(response){
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    response.end();
}

function isEmpty(obj) {
	return (Object.getOwnPropertyNames(obj).length === 0);
}

function newQueryClause(params) {
	let mysql = require('mysql');
	
	if (isEmpty(params)) {
		return '';
	}

	var qualification = '';
	var n = 0;
	var sortBy = '';
	var sort = '';
	for (var i in params) {
		let k = params[i];

		// i = mysql.escape(i);
		// k = mysql.escape(k);

		if(i != 'pageNum' && i != 'pageSize'){
			if(i == 'sortBy'){
				sortBy = k;
			}else if(i == 'sort'){
				sort = k;
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

	if(sort){
		qualification += ` ${sort}`;
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
	let host = req.headers.referer;
	if(!host)
		return;

	let activeCode = JSON.stringify({
		id: usrId,
		code: code
	});

	let crypto = require('./crypto.js');
	let encryptedCode = crypto.aesEncrypt(activeCode, require('./constant').aesKey);

	let emailSubject = 'www.yitube.cn 注册确认',
		emailContent = `你好 ${name}, 
			<a href="${host}?code=${encryptedCode}#/emailConfirm">点击</a>完成注册
			<br/>
			如无法打开，请复制以下链接
			<br/>
			${host}?code=${encryptedCode}#/emailConfirm`;

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

module.exports = {
    response404: response404,
    isEmpty: isEmpty,
	newClause: newQueryClause,
	formatTime: formatTime,
	convertSrt2vtt: convertSrt2vtt,
	scaleImage: scaleImage,
	sendActiveEmail: sendActiveEmail,
	copyFile: copyFile
}