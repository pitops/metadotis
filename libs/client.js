const path = require('path')
const crypto = require('crypto')
const WebTorrent = require('webtorrent')
const FSChunkStore = require('fs-chunk-store')

let client = new WebTorrent()
let dataPath = path.resolve(__dirname, '..', 'data')

function on (...args) {
  return client.on(...args)
}

function get (hash) {
  let torrent = client.torrents.find(torrent => torrent.infoHash.toLowerCase() === parse(hash))

  if (torrent) {
    torrent.files = torrent.files
      .map(file => {
        file.id = getHash(file.name)
        return file
      })
  }

  return torrent
}

function torrents () {
  let torrents = client.torrents
    .map(torrent => {
      torrent.files = torrent.files
        .map(file => {
          file.id = getHash(file.name)
          return file
        })

      return torrent
    })

  return torrents
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
  let old = get(magnet)
  if (old) {
    console.log(`magnet ${magnet} already added`)
    return Promise.resolve(old)
  }

  console.log(`adding new magnet ${magnet}`)
  return await new Promise(resolve => client.add(magnet, {path: dataPath, store: FSChunkStore}, resolve))
}

function parse (magnet) {
  let parts = magnet.split('btih:')

  let hash = parts.length > 1
    ? parts.slice(1).shift().split('&').shift()
    : parts.shift()

  return hash.toLowerCase()
}

function getHash (string) {
  const hash = crypto.createHash('sha256')
  hash.update(string)
  return hash.digest('hex')
}

module.exports = {on, add, get, status, torrents}
