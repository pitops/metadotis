let lib = require('./1337x')

describe('1337x torrents', () => {
  test('search', async () => {
    let results = await lib.search('pirate', 1)
    expect(results.length).toBeTruthy()
  }, 10 * 1000)
})
