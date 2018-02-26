const path = require('path')
const WebTorrent = require('webtorrent')

let client = new WebTorrent()
let dataPath = path.resolve(__dirname, '..', 'data')

function on (...args) {
  return client.on(...args)
}

function get (hash) {
  return client.torrents.find(torrent => torrent.infoHash.toLowerCase() === hash.toLowerCase())
}

function files (hash) {
  let torrent = get(hash)

  if (!torrent) {
    throw new Error('torrent not found')
  }

  return torrent.files
}

function status (hash = null) {
  let _status = torrent => ({
    upload: (torrent.uploadSpeed / 1000).toFixed(2) + ' Kb/s',
    download: (torrent.downloadSpeed / 1000).toFixed(2) + ' Kb/s',
    progress: (torrent.progress * 100).toFixed(2) + ' %'
  })

  if (hash === null) {
    return _status(client)
  }

  return _status(get(hash))
}

async function add (magnet) {
  return new Promise(resolve => client.add(magnet, {path: dataPath}, resolve))
}

async function seed (file, name) {
  return new Promise(resolve => client.seed(file, {name}, resolve))
}

module.exports = {on, get, files, status, add, seed}
