let uuid = require('uuid/v4')
let puppeteer = require('puppeteer')

let isDev = process.env.NODE_ENV !== 'production' && !!process.env.DEBUG
let browser = puppeteer.launch({
  // slowMo: isDev,
  headless: !isDev,
  // devtools: isDev,
  userDataDir: '/tmp/metadotis' //+ uuid()
})

async function newPage () {
  return await (await browser).newPage()
}

module.exports = {newPage}
