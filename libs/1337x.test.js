let lib = require('./1337x')

describe('1337x', () => {
  test('search', async () => {
    let result = await lib.search('pirate', 1)
    expect(result.movies.length > 1).toBeTruthy()
  }, 30 * 1000)
})
