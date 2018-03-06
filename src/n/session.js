function newSession(){
    const NodeSession = require('node-session');
    const constants = require('./constant');
    
	let session = new NodeSession({
		secret: constants.sessionSecret,
		'lifetime': 3 * 60 * 60 * 1000, // 3 hour
		'expireOnClose': false,
		'cookie': 'yi_tube',
	});
	return session;
}

module.exports.newSession = newSession;