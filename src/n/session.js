function newSession(){
    const NodeSession = require('node-session');
    const CONSTANT = require('./constant');
    
	return new NodeSession({
		secret: CONSTANT.sessionSecret,
		'lifetime': 3 * 60 * 60 * 1000, // 3 hour
		'expireOnClose': false,
		'cookie': 'tube',
		'secure': true,
		// 'encrypt': true
		// 'lottery': [2, 100],
	});
}

module.exports.newSession = newSession;