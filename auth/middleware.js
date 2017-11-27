const jwt = require('jsonwebtoken')
const secretKey = require('./secret')

module.exports = middleware

function middleware(req, res, next) {
  var authorization = req.get('Authorization')
  if (!authorization) {
    sendNotAllowed(res)
    return;
  }

  var scheme = authorization.split(' ')[0],
      token = authorization.split(' ')[1]
  if (scheme !== 'JWT' || token === '') {
    sendNotAllowed(res)
    return;
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      sendNotAllowed(res)
    } else {
      req.tokenPayload = decoded
      next()
    }
  })
}

function sendNotAllowed(res) {
  res.status(401).json({
    message: 'Not allowed'
  })
}