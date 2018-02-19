module.exports = {
  apps: [{
    name: 'bridge',
    script: 'npm start',
    watch: false,
    env: {
      'NODE_ENV': 'production',
      'PORT': 3000
    }
  }]
}
