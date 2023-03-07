const bcrypt = require('bcryptjs')

const hashPwd = (pwd) => {
    return bcrypt.hashSync(pwd)
}

const comparePwd = (pwd, hashedPw) => {
    return bcrypt.compareSync(pwd, hashedPw)
}

module.exports = { hashPwd, comparePwd }