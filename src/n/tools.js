function response404(response){
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    response.write("This request URL " + global.pathname + " was not found on this server.");
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
	for (var i in params) {
		let k = params[i];

		// i = mysql.escape(i);
		k = mysql.escape(k);
		
		n == 0?
			qualification += i + '=' + k:
			qualification += ' and ' + i + '=' + k;

		n ++;
	}

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

function usrAuthority(usrInfo){
	let authority = 1;

	if(usrInfo.type == 1){
		authority = 10;
		if(usrInfo.isAdmin == 1){
			authority = 100;
		}
	}

	return authority;
}

module.exports = {
    response404: response404,
    isEmpty: isEmpty,
	newClause: newQueryClause,
	formatTime: formatTime,
	usrAuthority: usrAuthority
}