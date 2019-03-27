const express = require('express')
const router = express.Router()
module.exports = router

router.get('/', (req, res) => {
  res.send("<h1>Student API</h1>")
})

router.use('/',require('../../middleware/checkauth'))

router.use('/image',require('./image'))
router.use('/info',require('./info'))
router.use('/search',require('./search'))
router.use('/history',require('./history'))
