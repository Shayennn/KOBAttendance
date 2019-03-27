const express = require('express')
const router = express.Router()
module.exports = router

const axios = require('axios')

const {
    VerifyNisitID,
    GetNisitIDChecksum
} = require('./VerifyNisitID')

const {
    check,
    validationResult
} = require('express-validator/check');


router.get('/', async (req, res) => {
    if (req.query.keyword == null) {
        res.send({
            error: true,
            msg: 'Please privide more param',
            params: {
                keyword: 'Search keyword'
            }
        })
    }
    let db = req.db
    let keyword = req.query.keyword

    if (isNumber(keyword)) {
        if (is14Digits(keyword)) {
            keyword = keyword.slice(3, 13)
        }
        if (keyword.length != 10) {
            res.send({
                searchBy: 'NisitID',
                keyword: keyword,
                result: null,
                error: 'Invalid NisitID'
            })
        }
        if (!VerifyNisitID(keyword)) {
            keyword = keyword.slice(0, 9) + GetNisitIDChecksum(keyword)
        }
        let rows = await db.prepare('SELECT * FROM `registered` WHERE StudentID = ?').bind(keyword).all()
        if (rows.length == 0) {
            await axios.get(AppConfig.api.student.info.replace('[ID]', parseInt(keyword.slice(0, 11))))
                .then(resp => {
                    if (resp.data.status) {
                        let name = resp.data.thainame.split(' ')[1]
                        rows.push({
                            StudentID: parseInt(resp.data.idcode),
                            Name: name,
                            Surname: resp.data.thainame.split(name + ' ')[1],
                            ENName: resp.data.engname.split(' ')[0],
                            ENSurname: resp.data.engname.split(' ')[1]
                        })
                    }
                })
        }
        res.send({
            searchBy: 'NisitID',
            keyword: keyword,
            result: rows
        })
    } else if (/^\/[0-9]{2,5}$/.test(keyword)) {
        keyword = keyword.replace('/', '')
        let rows = await db.prepare('SELECT * FROM `registered` WHERE StudentID LIKE ?').bind('%' + keyword).all()
        res.send({
            searchBy: 'NisitID Surfix',
            keyword: keyword,
            result: rows
        })
    } else {
        name_split = keyword.split(' ')
        if (name_split.length == 1) {
            name_split.push('')
        }
        if (isEnglish(keyword)) {
            let rows = await db.prepare('SELECT * FROM `registered` WHERE soundex(`ENName`) = soundex(?) OR soundex(`ENSurname`) = soundex(?)').bind(name_split).all()
            res.send({
                searchBy: 'EnglishName then Soundex',
                keyword: name_split,
                result: rows
            })
        } else {
            const param = {
                first: name_split[0]+'%',
                second: name_split[1]+'%'
            }
            let rows = await db.prepare('SELECT * FROM `registered` WHERE `Name` LIKE $first AND `Surname` LIKE $second').bind(param).all()
            res.send({
                searchBy: 'ThaiName',
                keyword: param,
                result: rows
            })
        }
    }
})

function isNumber(str) {
    return /^[0-9]+$/.test(str)
}

function is14Digits(str) {
    return /^[0-9]{14}$/.test(str)
}

function isEnglish(str) {
    return /^[\sA-Za-z]+$/.test(str)
}