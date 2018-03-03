const request = require('request-promise-native')
const cheerio = require('cheerio')

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

  return movies
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

  return movies
}

async function poster (id, width = 200, height) {
  let response = await request.get('http://www.imdb.com/title/' + id)
  let $ = cheerio.load(response)

  let owre = /ux\d+/i
  let cropre = /cr\d+,\d+,\d+,\d+/i
  let image = $('.poster a img').attr('src')
  // https://images-na.ssl-images-amazon.com/images/M/MV5BMTYzMDE2MzI4MF5BMl5BanBnXkFtZTgwNTkxODgxOTE@._V1_UX500_CR0,0,500,600_AL_.jpg

  let ow = parseInt(image.match(owre).shift().replace('UX', ''))
  let oh = parseInt(image.match(cropre).shift().split(',').pop())
  height = height || Math.floor(width / ow * oh)

  let newImage = image.replace(owre, `UX${width}`).replace(cropre, `CR0,0,${width},${height}`)

  // console.log({ow, oh, width, height, newImage})
  return newImage
}

module.exports = {popular, search, poster}
