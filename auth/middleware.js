const jwt = require('jsonwebtoken')
const secretKey = require('./secret')

module.exports = middleware

function middleware(req, res, next) {
  var authorization = req.get('Authorization')
  if (!authorization) {
    sendForbidden(res)
    return;
  }

  var scheme = authorization.split(' ')[0],
      token = authorization.split(' ')[1]
  if (scheme !== 'JWT' || token === '') {
    sendForbidden(res)
    return;
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      sendForbidden(res)
    } else {
      req.tokenPayload = decoded
      next()
    }
  })
}

function sendForbidden(res) {
  res.status(403).json({
    message: 'Forbidden'
  })
}