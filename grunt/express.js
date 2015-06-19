module.exports = {
  //options: {
    // Override defaults here
  //},
  dev: {
    options: {
      script: './server/server.js',
      background: false,
      port: 5002
    }
  },
  devReload: {
    options: {
      script: './server/server.js',
      background: true,
      port: 4000
    }
  },
  prod: {
    options: {
      script: './server/server.js',
      node_env: 'production',
      background: false,
      port: 5002
    }
  }
}
