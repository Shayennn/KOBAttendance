global.AppConfig = require('./api.config')

const express = require('express')
const moment = require('moment')
const app = express()
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use((req, res, next) => {
    console.log(`LOGGED:${moment().format('MMMM Do YYYY,h:mm:ss a')}`)
    next()
})

app.use('/test', (req, res, next) => {
    console.log(`LOGGED2:${moment().format('MMMM Do YYYY,h:mm:ss a')}`)
    next()
})

app.use((req, res, next) => {
    req.db = require('./lib/db')
    next()
})

app.get('/', (req, res) => {
    res.send({
        id: 1,
        name: 'Phitchawat'
    })
})
app.get('/test', (req, res) => {
    res.send({
        id: 2,
        name: 'Phitchawat'
    })
})

app.use('/api', require('./api'))

app.listen(5000, () => console.log('Example app listening on port 5000!'))