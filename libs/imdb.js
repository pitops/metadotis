const request = require('request-promise-native')
const cheerio = require('cheerio')
const async = require('async')

async function popular () {
  let response = await request.get('http://www.imdb.com/chart/moviemeter')
  let $ = cheerio.load(response)

  let movies = $('.lister-list > tr')
    .map(function () {
      let id = $(this).find('.titleColumn a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
      let year = $(this).find('.titleColumn .secondaryInfo').html().replace(/[()]/g, '')
      let title = $(this).find('.titleColumn a').html()
      let rating = $(this).find('.titleColumn .ratingColumn strong').html()

      return {id, year, title, rating}
    })
    .toArray()

  return await _addPosters(movies)
}

async function search (query) {
  let response = await request.get('http://www.imdb.com/search/title?title=' + query)
  let $ = cheerio.load(response)

  let movies = $('.lister-list > .lister-item')
    .map(function () {
      let id = $(this).find('.lister-item-header a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
      let year = $(this).find('.lister-item-header span').last().html().replace(/[()]/g, '')
      let title = $(this).find('.lister-item-header a').html()
      let rating = $(this).find('.ratings-imdb-rating strong').html()

      return {id, year, title, rating}
    })
    .toArray()

  return await _addPosters(movies)
}

async function posterData (id) {
  let response = await request.get('http://www.imdb.com/title/' + id)
  let $ = cheerio.load(response)

  let image = $('.poster a img').attr('src')
  // https://images-na.ssl-images-amazon.com/images/M/MV5BMTYzMDE2MzI4MF5BMl5BanBnXkFtZTgwNTkxODgxOTE@._V1_UX500_CR0,0,500,600_AL_.jpg

  if (!image) {
    return {width: 67, height: 98, template: 'https://images-na.ssl-images-amazon.com/images/G/01/imdb/images/nopicture/67x98/film-2500266839._CB514893543_.png'}
  }

  let cropre = /cr\d+,\d+,\d+,\d+/i
  let crop = image.match(cropre) || ['0,0,200,200']

  let parts = crop.shift().split(',')
  let ow = parseInt(parts[3])
  let oh = parseInt(parts[2])

  let template = image
    .replace(/ux\d+/i, `UX{width}`)
    .replace(/uy\d+/i, `UY{height}`)
    .replace(cropre, `CR0,0,{width},{height}`)

  let width = 500
  let height = Math.floor(width / ow * oh)

  return {width, height, template}
}

async function _addPosters (movies) {
  return new Promise((resolve, reject) => {
    async.mapLimit(movies, 5, async movie => {
      let data = await posterData(movie.id)

      movie.poster = data.template
        .replace(/\{width\}/ig, data.width)
        .replace(/\{height\}/ig, data.height)

      movie.posterData = data

      return movie
    }, (error, data) => error ? reject(error) : resolve(data))
  })
}

module.exports = {popular, search, posterData}
