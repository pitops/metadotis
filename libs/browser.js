let uuid = require('uuid/v4')
let puppeteer = require('puppeteer')

let isDev = process.env.NODE_ENV !== 'production' && !!process.env.DEBUG
let browser

async function newPage () {
  if (!browser) {
    browser = await puppeteer.launch({
      slowMo: isDev,
      headless: !isDev,
      devtools: isDev,
      userDataDir: '/tmp/metadotis'
    })
  }

  return await browser.newPage()
}

module.exports = {newPage}
