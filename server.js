const express = require('express')
const bodyParser = require('body-parser')
const hash = require('password-hash').generate
const morgan = require('morgan')
const chalk = require('chalk')
const authRouter = require('./auth')
const pageRouter = require('./pageRouter')
const protected = require('./auth/middleware')
const db = require('./db')

const server = express()

server.use(morgan('HTTP:http-version :method :url :status :response-time(ms)'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.get('/users', (req, res) => {
  res.json(db.getUsers())
})

server.post('/user', (req, res, next) => {
  let { email, password } = req.body
  let user = db.getUserByEmail(email)
  if (user) {
    // conflict
    res.status(409).json({
      message: 'Conflict'
    })
    return;
  }

  user = { email, password: hash(password) }
  // created
  res.status(201).json({
    message: 'ok', id: db.putUser(user)
  })
})

server.use('/page', pageRouter)
server.use('/api', authRouter)
server.use(protected)


// TODO Some protected API goes here


server.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found'
  })
})

const PORT = process.env.PORT || 3333
server.listen(PORT, () => 
  console.log(`Server is running on port ${chalk.cyan(PORT)}...\n`))
