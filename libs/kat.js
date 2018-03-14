const bytes = require('bytes')
const cheerio = require('cheerio')
const request = require('request-promise-native')
const respected = require('./respected')
const userAgent = require('./user-agent')

async function search (q, page = 1) {
  let req = `https://katcr.co/katsearch/page/${page}/${q}`
  let response = await request.get(req, {headers: {'User-Agent': userAgent}})

  let $ = cheerio.load(response)

  let movies = $('table.table tr')
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
    .filter(m => !!respected().find(re => re.test(m.uploader)))

  movies
    .forEach(movie => {
      movie.size = bytes.parse(movie.size)
    })

  return movies
}

module.exports = {search}
