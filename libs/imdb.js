const browser = require('./browser')
const goToWait = 100
const goToOptions = {waitLoad: true, waitNetworkIdle: true}

async function searchMovies (query) {
  return await _search(query, 'feature')
}

async function searchSeries (query) {
  return await _search(query, 'tv_series')
}

async function popularMovies () {
  return await _popular('moviemeter')
}

async function popularSeries () {
  return await _popular('tvmeter')
}

async function details (id) {
  let page = await browser.newPage()
  await page.setViewport({width: 1024, height: 1024})

  await page.goto('https://www.imdb.com/title/' + id, goToOptions)
  await page.waitFor(goToWait)

  let details = await page
    .evaluate(() => {
      let year = $('.title_wrapper h1 span').text().replace(/[\(\)]/g, '')
      let title = $('.title_wrapper h1').text().replace(/\(\d+\)\s+$/, '').trim()
      let rating = $('.ratingValue strong span').text()
      let poster = $('.poster a img').attr('src').replace(/^.*\.com/i, `/posters`)
      let actors = $('.cast_list tr [itemprop="actor"] a span').toArray().map(item => $(item).text())
      let summary = $('.summary_text').text().trim()
      let writers = $('[itemprop="creator"] a span').toArray().map(item => $(item).text())
      let director = $('[itemprop="director"] a span').toArray().map(item => $(item).text())

      return {year, title, rating, poster, actors, summary, writers, director}
    })
  page.close()

  details.id = id
  details.posterData = posterData(details.poster)

  return details
}

async function season (id, index) {
  let page = await browser.newPage()
  await page.setViewport({width: 1024, height: 100000})
  await page.goto(`https://www.imdb.com/title/${id}/episodes${index ? '?season=' + index : ''}`, goToOptions)
  await page.waitFor(goToWait)

  let season = await page
    .evaluate(() => {

      let episodes = $('.list.detail > .list_item')
        .map(function () {
          let id = $(this).find('.info strong a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
          let title = $(this).find('.info strong a').html()
          let rating = $(this).find('.info >div > div span.ipl-rating-star__rating').html().trim()
          let poster = $(this).find('.image img').attr('src')

          return {id, title, rating, poster}
        })
        .toArray()

      let season = parseInt($('#bySeason option:selected').text())

      return {season, episodes}
    })
  page.close()

  season.episodes
    .forEach(episode => {
      episode.posterData = posterData(episode.poster)
    })

  return season
}

async function seasons (id) {
  let last = await season(id)
  let indexes = []

  for (let i = 1; i < last.season; i++) {
    indexes.push(i)
  }

  let seasons = await Promise.all(indexes.map(async index => await season(id, index)))
  seasons.push(last)

  return seasons
}

async function _search (query, type) {
  let page = await browser.newPage()

  await page.setViewport({width: 1024, height: 100000})
  await page.goto(`http://www.imdb.com/search/title?title=${query}&title_type=${type}&view=simple`, goToOptions)
  await page.waitFor(goToWait)

  let movies = await page.evaluate(() => {
    return $('.lister-list > .lister-item')
      .map(function () {
        let id = $(this).find('.lister-item-header a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
        let year = $(this).find('.lister-item-header .lister-item-year').text().replace(/[()]/g, '').trim()
        let title = $(this).find('.lister-item-header a').text()
        let rating = $(this).find('.col-imdb-rating strong').text().trim()
        let poster = $(this).find('.lister-item-image a img').attr('src')

        return {id, year, title, rating, poster}
      })
      .toArray()
  })
  page.close()

  movies
    .forEach(movie => {
      movie.posterData = posterData(movie.poster)

      if (movie.year.match(/–$/)) {
        movie.year += 'present'
      }
    })

  return movies
}

async function _popular (type) {
  let page = await  browser.newPage()

  await page.setViewport({width: 1024, height: 100000})
  await page.goto('http://www.imdb.com/chart/' + type, goToOptions)
  await page.waitFor(goToWait)

  let movies = await page
    .evaluate(() => {
      return $('.lister-list > tr')
        .map(function () {
          let id = $(this).find('.titleColumn a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
          let year = $(this).find('.titleColumn .secondaryInfo').html().replace(/[()]/g, '')
          let title = $(this).find('.titleColumn a').html()
          let rating = $(this).find('.ratingColumn strong').html()
          let poster = $(this).find('.posterColumn a img').attr('src').replace(/^.*\.com/i, `/posters`)

          return {id, year, title, rating, poster}
        })
        .toArray()
    })
  page.close()

  movies.forEach(movie => movie.posterData = posterData(movie.poster))
  return movies
}

function posterData (poster) {
  if (!poster) {
    return {width: 67, height: 98, template: 'https://images-na.ssl-images-amazon.com/images/G/01/imdb/images/nopicture/67x98/film-2500266839._CB514893543_.png'}
  }

  let cropre = /cr\d+,\d+,\d+,\d+/i
  let crop = poster.match(cropre) || ['0,0,200,200']

  let parts = crop.shift().split(',')
  let ow = parseInt(parts[3])
  let oh = parseInt(parts[2])

  let template = poster
    .replace(/ux\d+/i, `UX{width}`)
    .replace(/uy\d+/i, `UY{height}`)
    .replace(cropre, `CR0,0,{width},{height}`)

  let width = 500
  let height = Math.floor(width / ow * oh)

  return {width, height, template}
}

module.exports = {searchMovies, searchSeries, popularMovies, popularSeries, details, season, seasons}
