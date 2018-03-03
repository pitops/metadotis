let imdb = require('./imdb')

describe('imdb', () => {
  test('get most popular', async () => {
    let results = await imdb.popular()
    expect(results.length).toEqual(100)
  }, 30 * 1000)

  test('search', async () => {
    let results = await imdb.search('pirate')
    expect(results.length).toEqual(50)
  }, 30 * 1000)

  test('poster', async () => {
    let result = await imdb.poster('tt4158110')

    expect(result.length).toBeGreaterThan(10)
  }, 30 * 1000)

  test('poster with custom width', async () => {
    let result = await imdb.poster('tt4158110', 400)
    expect(result.length).toBeGreaterThan(10)
  }, 30 * 1000)

  test('poster with custom size', async () => {
    let result = await imdb.poster('tt0343818', 500, 600)
    expect(result.length).toBeGreaterThan(10)
  }, 30 * 1000)
})
