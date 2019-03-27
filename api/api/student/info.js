const express = require('express')
const router = express.Router()
module.exports = router

const axios = require('axios')
const moment = require('moment')

const {
    VerifyNisitID,
    GetNisitIDChecksum
} = require('./VerifyNisitID')

const {
    check,
    validationResult
} = require('express-validator/check');

router.get('/', [
    check('id').isNumeric({
        no_symbols: true
    }),
    check('id').isLength({
        min: 10,
        max: 10
    }),
    check('id').custom(VerifyNisitID)
], (req, res) => {
    if (req.query.id == null) {
        res.send({
            error: true,
            msg: 'Please privide more param',
            params: {
                id: 'Student ID'
            }
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const db = req.db
    const stmt = db.prepare('insert into student_data_log (Email, DataOwner, DataType, ViewingTime) values (?,?,?,?)')
    stmt.bind([
        req.auth.Email,
        req.query.id,
        'Info',
        moment().format(moment().ISO_8601)
    ])
    axios.get(AppConfig.api.student.info.replace('[ID]', parseInt(req.query.id.slice(0, 11))))
        .then(resp => {
            stmt.run()
            res.send(resp.data)
        }).catch(error => {
            console.log(error);
            res.send({
                error: true,
                msg: 'Not found'
            })
        })
})