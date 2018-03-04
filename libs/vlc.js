const exex = require('mz/child_process').exec

async function play (link) {
  await stop()
  const vlc = process.platform === 'darwin' ? '/Applications/VLC.app/Contents/MacOS/VLC' : 'vlc'
  return await exex(`nohup ${vlc} ${link} > /dev/null 2>&1 & disown`)
}

async function stop () {
  return await exex(`ps -fax | grep -i 'vlc' | grep -v grep | awk '{print $2}' | xargs kill`)
}

module.exports = {play, stop}
