const express = require('express')
const router = express.Router()

module.exports = router

router.get('/', async (req, res) => {
    if(req.auth.Level < 2){
        res.send({
            error: true,
            msg: 'Insufficient Permission'
        })
        return
    }
    const db = req.db
    let data = await db.prepare('SELECT * FROM login_log ORDER BY LoginTime DESC').all()
    res.send(data)
})