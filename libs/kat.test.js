let lib = require('./kat')

describe('kat torrents', () => {
  test('search', async () => {
    let results = await lib.search('robot', 1)
    expect(results.length).toBeTruthy()
  }, 30 * 1000)
})
