module.exports = {
	serveReload: {
		options: {
			'debug': false,
			'port': '4000',
			'base': 'serve-development/',
			open: false,
			keepalive: false,
			livereload: true
		}
	},
	serve: {
		options: {
			debug: true,
			port: '4000',
			base: 'serve-development/',
			open: false,
			keepalive: false
		}
	},
	serveNoOpen: {
		options: {
			debug: true,
			port: '4000',
			base: 'serve-development/',
			open: false,
			keepalive: true
		}
	}
};
