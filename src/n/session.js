function newSession(){
    const NodeSession = require('node-session');
    const constants = require('./constant');
    
	let session = new NodeSession({
		secret: constants.sessionSecret,
		'lifetime': 3 * 60 * 60 * 1000, // 3 hour
		'expireOnClose': false,
		'cookie': 'tube',
		'driver': 'file',
		// 'connection': {
		// 	'adapter': 'sails-mysql',
		// 	'port': 3306,
		// 	host: 'localhost',
		// 	user: 'root',
		// 	password: '62191056',
		// 	database: 'n',
		// },
		// 'table': 'sessions',
		'lottery': [2, 100],
	});

	return session;
}

module.exports.newSession = newSession;