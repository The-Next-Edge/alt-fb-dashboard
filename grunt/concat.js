module.exports = {
	options: {
		banner: '<%= banner %>',
		stripBanners: true,
	},
	dist: {
		src: [
		  'bower_components/jquery/jquery.js',
			'bower_components/underscore/underscore.js',
			'bower_components/backbone/backbone.js',
			'bower_components/howler/howler.js',
			'bower_components/Autolinker.js/dist/Autolinker.js',
			'bower_components/socket.io-client/dist/socket.io.js',
			'bower_components/SimpleWebRTC/simplewebrtc.bundle.js',
			'lib/libraries/require.js',
			'lib/libraries/classList.js',
			'lib/libraries/libraries.js',
			'lib/libraries/requestAnimationFrame.js',
			'lib/libraries/famous.js',
			'lib/libraries/firebase.js',
			// we only modify code that appears below here
			'lib/views/mapView.js',
			'lib/views/videoView.js',
			'lib/views/roomTopicView.js',
			'lib/views/chatView.js',
			'lib/room.js',
			'lib/app.js'
		],
		dest: 'dist/junto.js'
	}
};
