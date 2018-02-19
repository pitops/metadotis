const express = require('express')
const bridge = require('../lib/bridge')

let router = express.Router()

router.get('/', (req, res) => res.json({message: 'API'}))

router.post('/magnet', async (req, res, next) => {
  let magnet = req.body.magnet
  let hash
  try {
    hash = await bridge.addTorrent(magnet)
  } catch (e) {
    e.code = 1
    e.descreption = 'could not get magnet, maybe dead or not exist'
    return next(e)
  }

  res.json({hash: hash})
})

router.get('/files', (req, res, next) => {
  let hash = req.query.hash
  let files

  try {
    files = bridge.getFiles(hash)
  } catch (e) {
    e.code = 2
    e.descreption = 'could not get files'
    return next(e)
  }

  res.json({files: files.map(file => file.name)})
})

router.get('/file', (req, res, next) => {
  let hash = req.query.hash
  let name = req.query.name
  let range = req.headers.range

  let file
  try {
    file = bridge.getFile(hash, name)
  } catch (e) {
    e.code = 2
    e.descreption = 'could not get files'
    return next(e)
  }

  let fileLength = file.length
  let start = 0
  let end = fileLength - 1

  if (range) {
    let positions = range.replace(/bytes=/, '').split('-')
    start = parseInt(positions[0], 10)
    end = Math.min(parseInt(positions[1], 10), fileLength - 1)
  }

  let stream = file.createReadStream({start, end})
  let chunkSize = (end - start) + 1

  let head = {
    'Content-Range': 'bytes ' + start + '-' + end + '/' + fileLength,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4'
  }

  res.writeHead(206, head)
  stream.pipe(res)
  stream.on('error', next)
})

module.exports = router
