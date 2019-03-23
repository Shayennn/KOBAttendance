const express = require('express')
const router = express.Router()
module.exports = router

const axios = require('axios')

const {VerifyNisitID,GetNisitIDChecksum} = require('./VerifyNisitID')

const {
    check,
    validationResult
} = require('express-validator/check');

router.get('/', (req, res) => {
    if (req.query.keyword == null) {
        res.send({
            error: true,
            msg: 'Please privide more param',
            params: {
                keyword: 'Search keyword'
            }
        })
    }
    let keyword = req.query.keyword

    if(isNumber(keyword)){
        if(is14Digits(keyword)){
            keyword = keyword.slice(3,13)
        }
        if(!VerifyNisitID(keyword)){
            keyword = keyword.slice(0,9)+GetNisitIDChecksum(keyword)
        }
        res.send({
            searchBy: 'NisitID',
            keyword: keyword
        })
    }else if(/^\/[0-9]{2,5}$/.test(keyword)){
        keyword = keyword.replace('/','')
        res.send({
            searchBy: 'NisitID Surfix',
            keyword: keyword
        })
    }else{
        if(isEnglish(keyword)){
            res.send({
                searchBy: 'EnglishName then Soundex',
                keyword: keyword
            })
        }else{
            res.send({
                searchBy: 'ThaiName',
                keyword: keyword
            })
        }
    }
})

function isNumber(str){
    return /^[0-9]+$/.test(str)
}

function is14Digits(str){
    return /^[0-9]{14}$/.test(str)
}

function isEnglish(str){
    return /^[\sA-Za-z]+$/.test(str)
}
