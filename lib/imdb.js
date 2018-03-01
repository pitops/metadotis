const request = require('request-promise-native')
const cheerio = require('cheerio')

async function popular () {
  let response = await request.get('http://www.imdb.com/chart/moviemeter')
  let $ = cheerio.load(response)

  let movies = $('.lister-list > tr')
    .map(function () {
      return {
        year: $(this).find('.titleColumn .secondaryInfo').html().replace(/[()]/g, ''),
        title: $(this).find('.titleColumn a').html(),
        rating: $(this).find('.titleColumn .ratingColumn strong').html()
      }
    })
    .toArray()

  return movies
}

async function search (query) {
  let response = await request.get('http://www.imdb.com/search/title?title=' + query)
  let $ = cheerio.load(response)

  let movies = $('.lister-list > .lister-item')
    .map(function () {
      return {
        year: $(this).find('.lister-item-header span').last().html().replace(/[()]/g, ''),
        title: $(this).find('.lister-item-header a').html(),
        rating: $(this).find('.ratings-imdb-rating strong').html()
      }
    })
    .toArray()

  return movies
}

module.exports = {popular, search}
