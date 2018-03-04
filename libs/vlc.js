const exex = require('mz/child_process').exec

async function play (link) {
  await stop()
  return await exex(`nohup /Applications/VLC.app/Contents/MacOS/VLC ${link} > /dev/null 2>&1 & disown`)
}

async function stop () {
  return await exex(`ps -fax | grep -i 'vlc' | grep -v grep | awk '{print $2}' | xargs kill`)
}

module.exports = {play, stop}
