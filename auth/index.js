const express = require('express')
const router = express.Router()
const verify = require('password-hash').verify
const jwtsign = require('jsonwebtoken').sign
const db = require('../db')

const secretKey = require('./secret.js')

router.post('/login', (req, res, next) => {
  var { email, password } = req.body
  var user = db.getUserByEmail(email)
  if (!user) {
    res.status(404).json({
      message: 'Not found'
    })
    return;
  }

  if (verify(password, user.password)) {
    delete user.password
    var payload = Object.assign({}, user)
    res.status(200).json({
      message: 'ok' , 
      token: jwtsign(JSON.stringify(payload), secretKey)
    })
  } else {
    res.status(401).json({
      message: 'Not allowed'
    })
  }
})

module.exports = router