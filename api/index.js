global.AppConfig = require('./api.config')

const express = require('express')
const moment = require('moment')
const app = express()
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use((req,res,next) => {
    req.realip = req.connection.remoteAddress
    if((req.headers['x-forwarded-for']) === undefined){
        req.realip = req.headers['x-forwarded-for']
    }
    next()
})

app.use((req, res, next) => {
    console.log(`${moment().format('MMMM Do YYYY,h:mm:ss a')} ${req.realip} ${req.url}`)
    next()
})

app.use((req, res, next) => {
    req.db = require('./lib/db')
    next()
})

app.use('/api', require('./api'))

app.listen(5000, () => console.log('API listening on port 5000'))