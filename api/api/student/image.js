const express = require('express')
const router = express.Router()

const fs = require('fs')
const axios = require('axios')
const https = require('https');
const path = require('path')

const moment = require('moment')

const {VerifyNisitID,GetNisitIDChecksum} = require('./VerifyNisitID')

const {
    check,
    validationResult
} = require('express-validator/check');

const std_img_path = './data/student_image/'

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

    const db = req.db
    const stmt = db.prepare('insert into student_data_log (Email, DataOwner, DataType, ViewingTime) values (?,?,?,?)')
    stmt.bind([
        req.auth.Email,
        req.query.id,
        'Image',
        moment().format(moment().ISO_8601)
    ])
    let filename = std_img_path + parseInt(req.query.id) + '.jpg'
    if (fs.existsSync(filename)) {
        stmt.run()
        res.sendFile(filename, {
            root: path.join(__dirname, '../..')
        })
    } else {
        axios.get(AppConfig.api.student.image.replace('[FIRST3]',parseInt(req.query.id.slice(0, 3))).replace('[ID]',parseInt(req.query.id.slice(0, 11))), {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            responseType: 'arraybuffer'
        }).then(resp => {
            stmt.run()
            fs.writeFileSync(filename, resp.data, {
                flag: 'w'
            })
            res.sendFile(filename, {
                root: path.join(__dirname, '../..')
            })
        }).catch(error => {
            console.log(error);
            res.send({
                error: true,
                msg: 'Not found'
            })
        })
    }
})