const express = require('express')
const page = express()
const db = require('./db')

page.set('views', './view')
page.engine('pug', require('pug').__express);

page.get('/users/:email?', (req, res, next) => {
  if (!req.params.email) {
    res.json(db.getUsers()
      .map(user => {
        delete user['password']
        return user
      }
    ))
    return;
  }
  
  let email = req.params.email
  let user = db.getUserByEmail(email);
  delete user['password']
  res.json(user)
})

page.post('/user', (req, res, next) => {
  let { email, password } = req.body
  let user = db.getUserByEmail(email)
  if (user) {
    // conflict
    res.status(409).json({
      message: 'Conflict'
    })
    return;
  }

  let newUser = { email, password }
  // created
  res.json({
    message: 'ok', id: db.putUser(newUser)
  })
})

module.exports = page