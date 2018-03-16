const browser = require('./browser')

async function popular () {
  let page = await  browser.newPage()

  await page.setViewport({width: 1024, height: 100000})
  await page.goto('http://www.imdb.com/chart/moviemeter', {waitLoad: true, waitNetworkIdle: true})
  await page.waitFor(100)

  let movies = await page
    .evaluate(() => {
      return $('.lister-list > tr')
        .map(function () {
          let id = $(this).find('.titleColumn a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
          let year = $(this).find('.titleColumn .secondaryInfo').html().replace(/[()]/g, '')
          let title = $(this).find('.titleColumn a').html()
          let rating = $(this).find('.ratingColumn strong').html()
          let poster = $(this).find('.posterColumn a img').attr('src')

          return {id, year, title, rating, poster}
        })
        .toArray()
    })
  await page.close()

  movies.forEach(movie => movie.posterData = posterData(movie.poster))
  return movies
}

async function search (query) {
  let page = await browser.newPage()

  await page.setViewport({width: 1024, height: 100000})
  await page.goto('http://www.imdb.com/search/title?title=' + query, {waitLoad: true, waitNetworkIdle: true})
  await page.waitFor(100)

  let movies = await page.evaluate(() => {
    return $('.lister-list > .lister-item')
      .map(function () {
        let id = $(this).find('.lister-item-header a').attr('href').replace(/\/title\//i, '').replace(/\/.+/i, '')
        let year = $(this).find('.lister-item-header span').last().html().replace(/[()]/g, '')
        let title = $(this).find('.lister-item-header a').html()
        let rating = $(this).find('.ratings-imdb-rating strong').html()
        let poster = $(this).find('.lister-item-image a img').attr('src')

        return {id, year, title, rating, poster}
      })
      .toArray()
  })
  page.close()

  movies.forEach(movie => movie.posterData = posterData(movie.poster))
  return movies
}

async function details (id) {
  let page = await browser.newPage()
  await page.setViewport({width: 1024, height: 1024})

  await page.goto('https://www.imdb.com/title/' + id, {waitLoad: true, waitNetworkIdle: true})
  await page.waitFor(100)

  let details = await page
    .evaluate(() => {
      let year = $('.title_wrapper h1 span').text().replace(/[\(\)]/g, '')
      let title = $('.title_wrapper h1').text().replace(/\(\d+\)\s+$/, '').trim()
      let rating = $('.ratingValue strong span').text()
      let poster = $('.poster a img').attr('src')
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

module.exports = {popular, search, details}
