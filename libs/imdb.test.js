let imdb = require('./imdb')

describe('imdb', () => {
  test('get most popular', async () => {
    let results = await imdb.popular()
    expect(results.length).toEqual(100)
  }, 60 * 1000)

  test('search', async () => {
    let results = await imdb.search('pirate')
    expect(results.length).toEqual(50)
  }, 60 * 1000)

  test('posterData', async () => {
    let result = await imdb.posterData('tt4158110')
    expect(result.template.length).toBeGreaterThan(10)
  }, 60 * 1000)
})
