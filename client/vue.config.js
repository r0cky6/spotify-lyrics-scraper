var path = require('path');
module.exports = {
	outputDir: '../server/public',
	devServer: {
    proxy: {
      '^/api': {
        target: 'https://localhost:5000'
      }
    },
    port: 8080,
    https: true,
    hotOnly: false,
    public: '0.0.0.0:8080'
	}
}