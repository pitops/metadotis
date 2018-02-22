let exec = require('mz/child_process').exec
let axios = require('axios')

beforeAll(async done => {
  await exec('pm2 restart pm2.dev.config.js', {cwd: __dirname})
  setTimeout(done, 500)
})

test('post new magnet', async () => {
  let magnet = 'magnet:?xt=urn:btih:B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
  let response = await axios.post('http://localhost:3000/api/magnet', {magnet})

  expect(response.status).toEqual(200)
  expect(response.data.hash.length).toEqual(40)
}, 20 * 1000)

test('post same magnet', async () => {
  let magnet = 'magnet:?xt=urn:btih:B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
  let response = await axios.post('http://localhost:3000/api/magnet', {magnet})

  expect(response.status).toEqual(200)
  expect(response.data.hash.length).toEqual(40)
})

test('get files', async () => {
  let hash = 'B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
  let response = await axios.get('http://localhost:3000/api/files?hash=' + hash)

  expect(response.status).toEqual(200)
  expect(response.data.files.length).toEqual(2)
})

test('get file', async () => {
  let hash = 'B35CBB10B3D10A4AD71797FC1EA925F78DF38367'
  let response = await axios.get('http://localhost:3000/api/files?hash=' + hash)

  let file = response.data.files.shift()
  response = await axios.get(`http://localhost:3000/api/file?hash=${hash}&name=${file}`)

  expect(response.status).toEqual(206)
  expect(response.data).toBeDefined()
})
