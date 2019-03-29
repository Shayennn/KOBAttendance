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
    if (data.length > 0) {
        res.send({
            status: false,
            msg: 'You cannot checkin for person that already checked.'
        })
    } else {
        const token = req.cookies['auth._token.google'].replace('Bearer ', '')
        const staff_stmt = req.db.prepare('select * from staff where Token = ?')
        staff_stmt.bind(token)
        const staff_data = await staff_stmt.get()
        let raw_data = null
        const regis = req.db.prepare('select * from registered where StudentID = ?')
        regis.bind(req.query.id)
        const std = await regis.get()    
        await axios.get(AppConfig.api.student.info.replace('[ID]', parseInt(req.query.id.slice(0, 11))))
        .then(resp => {
            resp.data['registered'] = std!==undefined
            raw_data = resp.data
        }).catch(error => {
            console.log(error);
            res.send({
                status: false,
                msg: 'Not found Student data'
            })
        })
        const std_data = {
            Fullname: raw_data.thainame.replace(raw_data.thainame.split(' ')[0]+' ', ''),
            ENFullname: raw_data.engname,
            isRegistered: raw_data.registered
        }
        const stmt = req.db.prepare('insert into attendance ( StudentID, Fullname, ENFullname, CheckInTime, Staff, isRegistered ) values (?,?,?,?,?,?)')
        stmt.bind([
            req.query.id,
            std_data.Fullname,
            std_data.ENFullname,
            moment().format(moment().ISO_8601),
            staff_data.Email,
            std_data.isRegistered?1:0
        ])
        if(await stmt.run()){
            res.send({
                status: true,
                msg: 'Checked'
            })
        } else {
            res.send({
                status: false,
                msg: 'Cannot INSERT data into db'
            })
        }
    }
})