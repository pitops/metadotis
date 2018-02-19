const IGNORE = [
  '.idea',
  'logs',
  'data',
  'node_modules'
]

module.exports = {
  apps: [{
    name: 'bridge',
    script: 'server.js',
    watch: ['lib', 'routes'],
    ignore_watch: IGNORE,
    env: {
      'NODE_ENV': 'development',
      'PORT': 3000
    }
  }]
}
