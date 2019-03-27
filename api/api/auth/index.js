const express = require('express')
const router = express.Router()
module.exports = router

router.get('/', (req, res) => {
  res.send("<h1>Auth API</h1>")
})

router.use('/check',require('./check'))
router.use('/logout',require('./logout'))