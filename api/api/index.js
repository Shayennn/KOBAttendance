const express = require('express')
const router = express.Router()
module.exports = router

router.use('/student', require('./student'))
router.use('/auth', require('./auth'))
router.use('/checkin', require('./checkin'))
