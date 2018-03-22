let imdb = require('./imdb')

describe('imdb', () => {
  test('get most popular movies', async () => {
    let results = await imdb.popularMovies()
    expect(results.length).toEqual(100)
  }, 10 * 1000)

  test('get most popular series', async () => {
    let results = await imdb.popularSeries()
    expect(results.length).toEqual(100)
  }, 10 * 1000)

  test('search movies', async () => {
    let results = await imdb.searchMovies('pirate')
    expect(results.length).toEqual(50)
  }, 10 * 1000)

  test('search series', async () => {
    let results = await imdb.searchSeries('pirate')
    expect(results.length).toEqual(50)
  }, 10 * 1000)

  test('details', async () => {
    let results = await imdb.details('tt1043740')
    expect(results).toBeTruthy()
  }, 10 * 1000)

  test('details episode', async () => {
    let results = await imdb.details('tt4730012')
    expect(results).toBeTruthy()
  }, 10 * 1000)

  test('season 1', async () => {
    let results = await imdb.season('tt4158110', 1)
    expect(results.episodes.length).toBeTruthy()
    expect(results.season).toEqual(1)
  }, 10 * 1000)

  test('latest season episodes', async () => {
    let results = await imdb.season('tt4158110')
    expect(results.episodes.length).toBeTruthy()
    expect(results.season).toBeTruthy()
  }, 10 * 1000)

  test('all seasons', async () => {
    let results = await imdb.seasons('tt4158110')
    expect(results.length).toBeTruthy()
  }, 20 * 1000)
})
