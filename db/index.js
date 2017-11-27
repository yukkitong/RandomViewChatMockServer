const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')
const idHash = require('object-hash')
const adapter = new FileSync(path.join(__dirname, 'db.json'))
const db = low(adapter)

exports.getUsers = () => db.get('users').value()

exports.getUserById = id => db.get('users').find({ id }).value()

exports.getUserByEmail = email => db.get('users').find({ email }).value()

exports.putUser = user => {
    var id = idHash(user),
        userWithId = Object.assign({ id }, user)
    db.get('users')
      .push(userWithId)
      .write()
    return id
  }
 