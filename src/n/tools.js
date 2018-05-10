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
		k = mysql.escape(k);

		if(i != 'pageNum' && i != 'pageSize'){
			if(i == 'sortBy'){
				sortBy = k;
			}else if(i == 'sort'){
				sort = k;
			}else{
				n == 0?
				qualification += i + '=' + k:
				qualification += ' and ' + i + '=' + k;
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

module.exports = {
    response404: response404,
    isEmpty: isEmpty,
	newClause: newQueryClause,
	formatTime: formatTime,
}