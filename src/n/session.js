function newSession(){
    const NodeSession = require('node-session');
    const constants = require('./constant');
    
	return new NodeSession({
		secret: constants.sessionSecret,
		'lifetime': 3 * 60 * 60 * 1000, // 3 hour
		'expireOnClose': false,
		'cookie': 'tube',
		// 'connection': {
		// 	'adapter': 'sails-mysql',
		// 	'port': 3306,
		// 	host: 'localhost',
		// 	user: 'root',
		// 	password: '62191056',
		// 	database: 'n',
		// },
		// 'table': 'sessions',
		// 'lottery': [2, 100],
	});
}

module.exports.newSession = newSession;