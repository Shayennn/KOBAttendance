const express = require('express')
const router = express.Router()
module.exports = router


router.get('/', async (req, res) => {
    const db = req.db
    const token = req.cookies['auth._token.google'].replace('Bearer ', '')
    const staff_stmt = req.db.prepare('select * from staff where Token = ?')
    staff_stmt.bind(token)
    const staff_data = await staff_stmt.get()
    const stmt = db.prepare('select * from attendance where Staff = ? or StaffCancel = ?')
    stmt.bind([
        staff_data.Email, staff_data.Email
    ])
    const myHistory = stmt.all()
    res.send(myHistory)
})