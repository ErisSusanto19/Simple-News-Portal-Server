const jwt = require('jsonwebtoken')

const YOOHOO = process.env.JWT_SIGN

const encode = (payload) => {
    return jwt.sign(payload, YOOHOO)
}

const decode = (token) => {
    return jwt.verify(token, YOOHOO)
}

module.exports = {encode, decode}