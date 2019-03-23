const express = require('express')
const router = express.Router()

const fs = require('fs')
const axios = require('axios')
const https = require('https');
const path = require('path')

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

    let filename = std_img_path + parseInt(req.query.id) + '.jpg'
    if (fs.existsSync(filename)) {
        console.log(filename)
        res.sendFile(filename, {
            root: path.join(__dirname, '..')
        })
    } else {
        axios.get(AppConfig.api.student.image.replace('[FIRST3]',parseInt(req.query.id.slice(0, 3))).replace('[ID]',parseInt(req.query.id.slice(0, 11))), {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            responseType: 'arraybuffer'
        }).then(resp => {
            fs.writeFileSync(filename, resp.data, {
                flag: 'w'
            })
            res.sendFile(filename, {
                root: path.join(__dirname, '..')
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