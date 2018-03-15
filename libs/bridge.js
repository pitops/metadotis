const client = require('./client')
const database = require('./database')

database.get('active-torrent')
  .then(async torrents => {
    console.log('restarting ', torrents)
    for (let torrent of (torrents || [])) {
      await client.add(torrent)
    }
  })
  .then(() => console.log('torrents restarted'))

client.on('error', error => console.error('ERROR', error.message))

client.on('torrent', async torrent => {
  let old = await database.get('active-torrent') || []
  let added = old.concat(torrent.infoHash)
  let filtered = added.filter((v, i, a) => a.indexOf(v) === i)

  await database.set('active-torrent', filtered)

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

function getTorrents () {
  let torrents = client.torrents()
  return torrents.map(torrent => {
    return {
      hash: torrent.infoHash,
      files: torrent.files.map(file => ({name: file.name, id: file.id})),
      status: client.status(torrent.infoHash)
    }
  })
}

function getFile (hash, fileId) {
  let torrent = client.get(hash)

  if (!torrent) {
    throw new Error('no torrent found')
  }

  return torrent.files.find(file => file.id === fileId)
}

function getStatus () {
  return client.status()
}

module.exports = {getTorrents, addTorrent, getTorrent, getFile, getStatus}
