module.exports = {
	"default": {
		options: {
			compress: false,
			paths: "less/"
		},
		files: {
			 "css/junto.css": "less/junto.less"
		}
	},
	dist: {
		options: {
			compress: true,
			paths: "less/"
		},
		files: {
			"css/junto.css": "less/junto.less"
		}
	}
};
