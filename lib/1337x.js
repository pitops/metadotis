const request = require('request-promise-native')
const cheerio = require('cheerio')
const respected = require('./respected')

async function getMovieMagnet (path) {
  let req = `http://1337x.to${path}`
  let response = await request.get(req)
  let $ = cheerio.load(response)
  return $('.download-links-dontblock li').first().find('a').attr('href')
}

async function search (q, page) {
  let req = `http://1337x.to/category-search/${q}/Movies/${page || 1}/`
  let response = await request.get(req)
  let $ = cheerio.load(response)

  let movies = $('tr')
    .map(function () {
      return {
        name: $(this).find('td.name a').last().html(),
        path: $(this).find('td.name a').last().attr('href'),
        seeds: $(this).find('td.seeds').html(),
        uploader: $(this).find('td.coll-5 a').html()
      }
    })
    .toArray()
    .filter(m => !!respected().find(re => re.test(m.uploader)))
    .map(async m => {
      let magnet = await getMovieMagnet(m.path)
      return {name: m.name, seeds: m.seeds, uploader: m.uploader, magnet: magnet}
    })

  let found = false
  let next = $('.pagination li')
    .filter(function () {
      if (found) {
        return true
      }
      found = $(this).attr('class') === 'active'
    })
    .map(function () {
      return $(this).find('a').html()
    })
    .toArray()
    .filter(v => parseInt(v))
    .shift()

  return {movies: await Promise.all(movies), next}
}

module.exports = {search}
