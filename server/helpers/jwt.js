const jwt = require("jsonwebtoken")
require('dotenv').config()
const secret = process.env.JWT_SECRET

const signToken = (data) => {
  return jwt.sign(data, secret)
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

function auth(req) {
  const authorization = req.headers.authorization
  if (!authorization) {
    throw new Error('Authorization header is required')
  }

  const token = authorization.replace('Bearer ', '') // Hapus "Bearer " dari header
  console.log('Extracted Token:', token)
  const payload = verifyToken(token) // Verifikasi token
  if (!payload) {
    throw new Error('Invalid token')
  }

  return payload // Kembalikan data payload untuk digunakan di resolver
}

module.exports = {
  auth,
  signToken,
  verifyToken
}
