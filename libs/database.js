const path = require('path')
const levelup = require('levelup')
const leveldown = require('leveldown')

let _db

async function databse () {
  if (_db) {
    return _db
  }
  _db = await levelup(leveldown(path.resolve(__dirname, '../database')))

  return _db
}

async function set (key, value) {
  let db = await databse()
  try {
    value = JSON.stringify(value)
  } catch (e) {}

  return await db.put(key, value)
}

async function get (key) {
  let db = await databse()
  let value = null

  try {
    value = await db.get(key)
  } catch (e) {}

  try {
    value = JSON.parse(value)
  } catch (e) {}

  return value
}

module.exports = {set, get}
