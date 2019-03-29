const express = require('express')
const router = express.Router()

const fs = require('fs')
const axios = require('axios')
const https = require('https');
const path = require('path')

const Jimp = require("jimp");

const moment = require('moment')

const {
    VerifyNisitID,
    GetNisitIDChecksum
} = require('./VerifyNisitID')

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
    // var imageCaption = req.auth.Email.split('@')[0].replace('.', ' ').toLowerCase()
    // imageCaption = [
    //     imageCaption.split(' ')[0].charAt(0).toUpperCase() + imageCaption.split(' ')[0].slice(1),
    //     imageCaption.split(' ')[1].charAt(0).toUpperCase() + imageCaption.split(' ')[1].slice(1),
    // ].join(' ')
    var imageCaption = req.auth.Email
    // imageCaption = [
    //     imageCaption.split(' ')[0].charAt(0).toUpperCase() + imageCaption.split(' ')[0].slice(1),
    //     imageCaption.split(' ')[1].charAt(0).toUpperCase() + imageCaption.split(' ')[1].slice(1),
    // ].join(' ')
    var loadedImage
    if (fs.existsSync(filename)) {
        stmt.run()
        Jimp.read(filename)
            .then(function (image) {
                loadedImage = image.resize(Jimp.AUTO,400)
                return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
            })
            .then(function (font) {
                loadedImage
                    .print(font, 20, 370, moment().format('DD-MM-YYYY HH:mm:ss Z'))
                    .print(font, 20, 10, 'Staff email')
                    .print(font, 40, 30, imageCaption)
                    .print(font, 20, 60, "NOT ALLOW TO MAKE A COPY")
                    .getBuffer(Jimp.MIME_JPEG, function (err, buffer) {
                        res.set("Content-Type", Jimp.MIME_JPEG);
                        res.send(buffer);
                    });
            })
            .catch(function (err) {
                console.error(err)
            })
    } else {
        axios.get(AppConfig.api.student.image.replace('[FIRST3]', parseInt(req.query.id.slice(0, 3))).replace('[ID]', parseInt(req.query.id.slice(0, 11))), {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            responseType: 'arraybuffer'
        }).then(resp => {
            stmt.run()
            fs.writeFileSync(filename, resp.data, {
                flag: 'w'
            })
            Jimp.read(filename)
                .then(function (image) {
                    loadedImage = image.resize(Jimp.AUTO,400)
                    return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
                })
                .then(function (font) {
                    loadedImage
                        .print(font, 20, 370, moment().format('DD-MM-YYYY HH:mm:ss Z'))
                        .print(font, 20, 10, 'Staff email')
                        .print(font, 40, 30, imageCaption)
                        .print(font, 20, 60, "NOT ALLOW TO MAKE A COPY")
                        .getBuffer(Jimp.MIME_JPEG, function (err, buffer) {
                            res.set("Content-Type", Jimp.MIME_JPEG);
                            res.send(buffer);
                        });
                })
                .catch(function (err) {
                    console.error(err)
                })
        }).catch(error => {
            res.send({
                error: true,
                msg: 'Not found'
            })
        })
    }
})