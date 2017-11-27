const express = require('express')
const bodyParser = require('body-parser')
const hash = require('password-hash').generate
const morgan = require('morgan')
const chalk = require('chalk')
const db = require('./db')

const server = express()

server.use(morgan('HTTP:http-version :method :url :status :response-time(ms)'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.get('/users', (req, res) => {
  res.json(db.getUsers())
})

server.post('/user', (req, res, next) => {
  var user = Object.assign({}, 
    req.body, 
    { password: hash(req.body.password) }
  )
  var id = db.putUser(user)
  res.status(200).json({
    message: "ok", id
  })
})

const PORT = process.env.PORT || 3333
server.listen(PORT, () => console.log(`Server is running on port ${chalk.cyan(PORT)}...\n`))
