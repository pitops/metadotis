const mime = require('mime')
const express = require('express')

const imdb = require('../libs/imdb')
const bridge = require('../libs/bridge')
const thirteen = require('../libs/1337x')

let router = express.Router()

router.get('/', (req, res) => res.json({message: 'API'}))

router.get('/movies/popular', async (req, res) => {
  let movies = await imdb.popular()
  res.json({movies})
})

router.get('/movies/poster/:id', async (req, res) => {
  let id = req.params.id
  let width = req.query.w
  let height = req.query.h

  let image = await imdb.poster(id, width, height)
  res.json({image})
})

router.get('/search/movies', async (req, res) => {
  let q = req.query.q
  let movies = await imdb.search(q)
  res.json({movies})
})

router.get('/search/torrents', async (req, res) => {
  let q = req.query.q
  let page = req.query.page
  let result = await thirteen.search(q, page)

  res.json(result)
})

router.get('/status/', (req, res, next) => {
  let status = bridge.getStatus()
  console.log({status})
  res.json(status)
})

router.post('/magnet', async (req, res, next) => {
  let magnet = req.body.magnet
  let hash

  try {
    hash = await bridge.addTorrent(magnet)
  } catch (e) {
    e.code = 1
    e.description = 'could not get magnet, maybe torrent is dead or does not exist'
    return next(e)
  }

  res.json({hash: hash})
})

router.get('/torrent/:hash', (req, res, next) => {
  let hash = req.params.hash
  let torrent

  try {
    torrent = bridge.getTorrent(hash)
  } catch (e) {
    e.code = 2
    e.description = 'could not get files'
    return next(e)
  }

  res.json(torrent)
})

router.get('/torrent/:hash/:fileid', (req, res, next) => {
  let hash = req.params.hash
  let fileid = req.params.fileid

  let range = req.headers.range

  console.log({hash, fileid, range})

  let file
  try {
    file = bridge.getFile(hash, fileid)
  } catch (e) {
    e.code = 2
    e.description = 'could not get files'
    return next(e)
  }

  let stream, fileLength = file.length
  let contentType = mime.getType(file.name.split('.').pop())
  let head = {'Content-Type': contentType, 'Accept-Ranges': 'bytes'}

  if (range) {
    let parts = range.replace(/bytes=/i, '').split('-')
    let start = parseInt(parts[0], 10)
    let end = fileLength - 1
    if (parts[1]) {
      end = Math.min(parseInt(parts[1], 10), end)
    }
    let chunkSize = end - start + 1

    head['Content-Range'] = 'bytes ' + start + '-' + end + '/' + fileLength
    head['Content-Length'] = chunkSize

    res.writeHead(206, head)
    stream = file.createReadStream({start, end})

  } else {
    head['Content-Length'] = fileLength
    res.writeHead(200, head)
    stream = file.createReadStream()
  }
  console.log(head)

  stream.pipe(res)
  stream.on('error', e => next(e))
})

module.exports = router
