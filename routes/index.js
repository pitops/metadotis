const express = require('express')

const api = require('./api')
const posters = require('./posters')

let router = express.Router()

router.use('/api', api)
router.use('/posters', posters)

module.exports = router
