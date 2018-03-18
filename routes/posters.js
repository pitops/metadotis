const express = require('express')
const request = require('request')

let router = express.Router()

router.get('/*', (req, res) => {
  let path = req.path.replace('/posters/', '')
  request.get('https://ia.media-imdb.com/' + path).pipe(res)
})

module.exports = router
