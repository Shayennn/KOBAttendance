const express = require('express')
const router = express.Router()

const axios = require('axios')
const moment = require('moment')
const {
    check,
    validationResult
} = require('express-validator/check');
const {
    VerifyNisitID,
    GetNisitIDChecksum
} = require('../student/VerifyNisitID')

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
            msg: 'Please privide more params',
            params: {
                id: 'Student ID'
            }
        })
    }
    const data = await req.db.prepare('select * from attendance where StudentID = ? AND CancelTime is null order by id desc').bind(req.query.id).all()
    if (data.length == 0) {
        res.send({
            status: false,
            msg: 'You cannot uncheck for person that\'s no check.'
        })
    } else {
        const token = req.cookies['auth._token.google'].replace('Bearer ', '')
        const staff_stmt = req.db.prepare('select * from staff where Token = ?')
        staff_stmt.bind(token)
        const staff_data = await staff_stmt.get()
        const stmt = req.db.prepare('update attendance set StaffCancel = ?, CancelTime = ? where StudentID = ? and CancelTime is null')
        stmt.bind([
            staff_data.Email,
            moment().format(moment().ISO_8601),
            req.query.id
        ])
        if(await stmt.run()){
            res.send({
                status: true,
                msg: 'Unchecked'
            })
        } else {
            res.send({
                status: false,
                msg: 'Cannot UPDATE data in db.'
            })
        }
    }
})