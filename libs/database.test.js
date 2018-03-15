let database = require('./database')

describe('database', () => {
  test('set string', async () => {
    await database.set('somekey', 'somevalue')
    let value = await database.get('somekey')
    expect(value).toEqual('somevalue')
  })

  test('set object', async () => {
    let someUser = {name: 'someUser'}
    await database.set('somekey', someUser)
    let value = await database.get('somekey')

    console.log(value)
    expect(value).toEqual(someUser)
  })

  test('set many', async () => {
    await Promise.all([
      await database.set('somekey', 'somevalue'),
      await database.set('someotherkey', 'someothervalue')
    ])

    let value = await database.get('somekey')
    let othervalue = await database.get('someotherkey')

    expect(value).toEqual('somevalue')
    expect(othervalue).toEqual('someothervalue')
  })
})
