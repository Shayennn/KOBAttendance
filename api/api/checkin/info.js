const express = require('express')
const router = express.Router()

const moment = require('moment')
const {
    check,
    validationResult
} = require('express-validator/check');
const {VerifyNisitID,GetNisitIDChecksum} = require('../student/VerifyNisitID')

module.exports = router

router.get('/', [
    check('id').isNumeric({
        no_symbols: true
    }),
    check('id').isLength({
        min: 10,
        max: 10
    }),
    check('id').custom(VerifyNisitID)
], async (req, res) => {
    if (req.query.id == null) {
        res.send({
            error: true,
            msg: 'Please privide more param',
            params: {
                id: 'Student ID'
            }
        })
    }
    const data = await req.db.prepare('select * from attendance where StudentID = ? order by id desc').bind(req.query.id).all()
    res.send(data)
})