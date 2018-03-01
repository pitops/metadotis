let exec = require('mz/child_process').exec
let axios = require('axios')

describe('api', () => {
  beforeAll(async (done) => {
    await exec('pm2 delete all', {cwd: __dirname})
    await new Promise(resolve => setTimeout(resolve, 1000))

    await exec('pm2 restart pm2.dev.config.js', {cwd: __dirname})
    await new Promise(resolve => setTimeout(resolve, 1000))

    done()
  }, 5 * 1000)

  test('get most popular movies', async () => {
    let response = await axios.get('http://localhost:3333/api/movies/popular')
    expect(response.data.movies.length).toEqual(100)
  }, 10 * 1000)

  test('search movies', async () => {
    let response = await axios.get('http://localhost:3333/api/movies/search?q=robot')
    expect(response.data.movies.length).toEqual(50)
  }, 10 * 1000)

  test('get status', async () => {
    let response = await axios.get('http://localhost:3333/api/status/')

    expect(response.status).toEqual(200)
    expect(response.data.upload).toBeDefined()
    expect(response.data.download).toBeDefined()
    expect(response.data.progress).toBeDefined()
  })

  test('post new magnet', async () => {
    let magnet = 'B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
    let response = await axios.post('http://localhost:3333/api/magnet/', {magnet})

    expect(response.status).toEqual(200)
    expect(response.data.hash.length).toEqual(40)
  }, 20 * 1000)

  test('post same magnet', async () => {
    let magnet = 'magnet:?xt=urn:btih:B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
    let response = await axios.post('http://localhost:3333/api/magnet', {magnet})

    expect(response.status).toEqual(200)
    expect(response.data.hash.length).toEqual(40)
  }, 10 * 1000)

  test('get torrent', async () => {
    let hash = 'B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
    let response = await axios.get('http://localhost:3333/api/torrent/' + hash)

    expect(response.status).toEqual(200)
    expect(response.data.files.length).toEqual(2)

  })

  test('get file', async () => {
    let hash = 'B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
    let response = await axios.get('http://localhost:3333/api/torrent/' + hash)

    let file = response.data.files.shift()
    response = await axios.get(`http://localhost:3333/api/torrent/${hash}/${file.id}`)

    expect(response.status).toEqual(200)
    expect(response.data).toBeDefined()
  })

  test('get file with range', async () => {
    let hash = 'B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
    let response = await axios.get('http://localhost:3333/api/torrent/' + hash)

    let file = response.data.files.shift()
    response = await axios.get(`http://localhost:3333/api/torrent/${hash}/${file.id}`, {headers: {'Range': 'Bytes=1000-'}})

    expect(response.status).toEqual(206)
    expect(response.data).toBeDefined()
  })
})
