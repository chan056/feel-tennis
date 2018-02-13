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
	
	if (isEmpty(params)) {
		return '';
	}

	var qualification = '';
	var n = 0;
	for (var i in params) {
		let k = params[i];
		// k = conn.escape(k);

		n == 0?
			qualification += i + '=' + k:
			qualification += ' and ' + i + '=' + k;

		n ++;
	}

	return qualification;
}

module.exports = {
    response404: response404,
    isEmpty: isEmpty,
	newClause: newQueryClause,
}