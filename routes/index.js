const router = require('express').Router()
const employee = require('./employee')
const customer = require('./customer')

router.use('/', employee)
router.use('/', customer)

module.exports = router