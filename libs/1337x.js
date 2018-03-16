const bytes = require('bytes')
const browser = require('./browser')

const respected = require('./respected')

async function getMovieMagnet (path) {
  let page = await browser.newPage()
  await page.setViewport({width: 1024, height: 1024})
  await page.goto(`http://1337x.to${path}`)

  let poster = await page
    .evaluate(() => $('.download-links-dontblock li').first().find('a').attr('href'))
  page.close()

  return poster
}

async function search (q, p) {
  let page = await browser.newPage()
  await page.setViewport({width: 1024, height: 1024})
  await page.goto(`http://1337x.to/category-search/${q}/Movies/${p || 1}/`)

  let movies = await page
    .evaluate(() => {
      return $('tr')
        .map(function () {
          return {
            name: $(this).find('td.name a').last().text(),
            path: $(this).find('td.name a').last().attr('href'),
            size: $(this).find('td.size').html(),
            seeds: $(this).find('td.seeds').text(),
            leeches: $(this).find('td.leeches').text(),
            uploader: $(this).find('td.coll-5 a').text()
          }
        })
        .toArray()
    })
  page.close()

  movies = movies
    .filter(m => !!respected().find(re => re.test(m.uploader)))
    .map(async m => {
      let magnet = await getMovieMagnet(m.path)
      return {
        name: m.name,
        size: bytes.parse(m.size.replace(/<span.*$/, '')),
        seeds: m.seeds,
        leeches: m.leeches,
        uploader: m.uploader,
        magnet: magnet,
        source: '1337x'
      }
    })

  return await Promise.all(movies)
}

module.exports = {search}
