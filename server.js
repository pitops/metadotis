const rotatingFlleStream = require('rotating-file-stream')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const index = require('./routes/index')

const app = express()

app.disable('x-powered-by')

const logDirectory = path.join(__dirname, 'logs')
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}

const port = process.env.PORT || 3000
const isDev = process.env.NODE_ENV !== 'production'
const logStream = rotatingFlleStream('server.log', {interval: '1d', path: logDirectory})

app.use(morgan(isDev ? 'dev' : 'short', {stream: logStream}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', index)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
