const { decode } = require('../helpers/jwt')
const { User, Customer } = require('../models')

const auth = async (req, res, next) => {
    try {
        const {access_token} = req.headers
        if(!access_token){
            throw {name: "InvalidToken"}
        }

        const payload = decode(access_token)
        if(payload.code !== 1 ){
            throw { name: "Forbidden"}
        }

        const user = await User.findByPk(payload.id)
        if(!user){
            throw {name: "InvalidToken"}
        }

        req.user = {
            id: user.id,
            role: user.role,
            email: user.email
        }

        next()
    } catch (err) {
        next(err)
    }
}

const authCust = async (req, res, next) => {
    try {
        const {access_token} = req.headers
        if(!access_token) throw {name: "InvalidToken"}

        const payload = decode(access_token)
        if(typeof payload.code !== 'undefined' ){
            throw { name: "Forbidden"}
        }

        const customer = await Customer.findByPk(payload.id)
        if(!customer) throw {name: "InvalidToken"}

        req.customer = {
            id: customer.id,
            email: customer.email
        }

        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { auth, authCust }