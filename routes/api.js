const mime = require('mime')
const express = require('express')

const vlc = require('../libs/vlc')
const imdb = require('../libs/imdb')
const bridge = require('../libs/bridge')

const kat = require('../libs/kat')
const thirteen = require('../libs/1337x')

let router = express.Router()

router.get('/', (req, res) => res.json({message: 'API'}))

router.post('/vlc/play', async (req, res) => {
  let hash = req.body.hash
  let fileId = req.body.fileId

  await vlc.play(`http://localhost:3333/api/torrent/${hash}/${fileId}`)

  res.json({status: 'OK'})
})

router.get('/details/:id', async (req, res) => {
  let id = req.params.id
  let details = await imdb.details(id)
  res.json({details: details})
})

router.get('/seasons/:id', async (req, res) => {
  let id = req.params.id
  let seasons = await imdb.seasons(id)
  res.json({seasons})
})

router.get('/movies/popular', async (req, res) => {
  let movies = await imdb.popularMovies()
  res.json({movies})
})

router.get('/series/popular', async (req, res) => {
  let movies = await imdb.popularSeries()
  res.json({movies})
})

router.get('/search/movies', async (req, res) => {
  let q = req.query.q
  let movies = await imdb.searchMovies(q)
  res.json({movies})
})

router.get('/search/series', async (req, res) => {
  let q = req.query.q
  let movies = await imdb.searchSeries(q)
  res.json({movies})
})

router.get('/search/torrents', async (req, res) => {
  let q = req.query.q
  let page = req.query.page

  let results = await Promise
    .all([
      kat.search(q, page),
      thirteen.search(q, page)
    ])

  let max = results.reduce((max, a) => max < a.length ? a.length : max, 0)
  let result = []
  for (let i = 0; i < max; i++) {
    for (let a = 0; a < results.length; a++) {
      if (results[a][i]) {
        result.push(results[a][i])
      }
    }
  }

  res.json({torrents: result})
})

router.get('/status/', (req, res, next) => {
  let status = bridge.getStatus()
  console.log({status})
  res.json({status})
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

  console.log('api response to add magnet hash ', hash)
  res.json({hash})
})

router.get('/torrents', (req, res, next) => {
  let torrents
  try {
    torrents = bridge.getTorrents()
  } catch (e) {
    e.code = 2
    e.status = 404
    e.description = 'could not get files'
    return next(e)
  }

  console.log('ready to respond to get torrents', torrents.length)
  res.json({torrents})
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

  console.log('ready to respond to get torrent ', torrent.files.length)
  res.json({torrent})
})

router.get('/torrent/:hash/:fileid', (req, res, next) => {
  let hash = req.params.hash
  let fileid = req.params.fileid

  let range = req.headers.range

  console.log('stream', {hash, fileid, range})

  let file
  try {
    file = bridge.getFile(hash, fileid)
  } catch (e) {
    e.code = 2
    e.status = 404
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
