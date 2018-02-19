let client = require('./client')

client.on('error', error => console.error('ERROR', error.message))

client.on('torrent', torrent => {
  console.log('on torrent', {hash: torrent.infoHash})
})

async function addTorrent (magnet) {
  let hash = magnet.split('btih:').slice(1, 2).pop()
  let exist = client.get(hash)
  if (exist) {
    return exist.infoHash
  }

  let torrent = await client.add(magnet)
  return torrent.infoHash
  // let file = torrent.files.find(file => file.name.match(/.*\.mp4/))
}

function getFiles (hash) {
  return client.files(hash)
}

function getFile (hash, filename) {
  let files = getFiles(hash)
  let file = files.find(file => file.name.toLowerCase() === filename.toLowerCase())

  if (!file) {
    throw new Error('file not found')
  }

  return file
}

module.exports = {addTorrent, getFiles, getFile}
