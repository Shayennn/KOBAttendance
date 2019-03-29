const express = require('express')
const router = express.Router()
module.exports = router

router.get('/', (req, res) => {
  res.send("<h1>Check-In API</h1>")
})

router.use('/',require('../../middleware/checkauth'))

router.use('/info',require('./info'))
router.use('/check',require('./check'))
router.use('/undo',require('./undo'))
