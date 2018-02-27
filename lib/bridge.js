let client = require('./client')

client.on('error', error => console.error('ERROR', error.message))

client.on('torrent', torrent => {
  console.log('on torrent', {hash: torrent.infoHash})
})

async function addTorrent (magnet) {
  let torrent = await client.add(magnet)
  return torrent.infoHash
}

function getTorrent (hash) {
  let torrent = client.get(hash)

  if (!torrent) {
    return
  }

  return {
    hash: torrent.infoHash,
    files: torrent.files.map(file => ({name: file.name, id: file.id})),
    status: client.status(hash)
  }
}

function getFile (hash, fileId) {
  let torrent = client.get(hash)
  return torrent.files.find(file => file.id === fileId)
}

function getStatus () {
  return client.status()
}

module.exports = {addTorrent, getTorrent, getFile, getStatus}
