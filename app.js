if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const { errHandler } = require('./middlewares/errHandler')
const app = express()
const router = require('./routes')
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(router)

app.use(errHandler)

module.exports = app