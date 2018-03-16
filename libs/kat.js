const bytes = require('bytes')
const browser = require('./browser')
const respected = require('./respected')

async function search (q, p) {
  let page = await browser.newPage()
  await page.setViewport({width: 1024, height: 1024})
  await page.goto(`https://katcr.co/katsearch/page/${p || 0}/${q}`)
  await page.reload()

  let movies = await page
    .evaluate(() => {
      return $('table.table tr')
        .map(function () {
          return {
            name: $(this).find('td > div > .text--left > a').text(),
            size: $(this).find('td[data-title="Size"]').text(),
            seeds: $(this).find('td[data-title="Seed"]').text(),
            Leeches: $(this).find('td[data-title="Leech"]').text(),
            uploader: $(this).find('td > div > .text--left > span > span > a').text(),
            magnet: $(this).find('td > div > .torrents_table__actions > a').last().attr('href'),
            source: 'kat'
          }
        })
        .toArray()
    })
  page.close()

  movies
    .filter(m => respected().find(re => re.test(m.uploader)))
    .forEach(movie => {
      movie.size = bytes.parse(movie.size)
    })

  return movies
}

module.exports = {search}
