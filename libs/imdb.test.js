let imdb = require('./imdb')

describe('imdb', () => {
  test('get most popular', async () => {
    let results = await imdb.popular()
    expect(results.length).toEqual(100)
  })

  test('search', async () => {
    let results = await imdb.search('pirate')
    expect(results.length).toEqual(50)
  })
})
