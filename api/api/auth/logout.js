const express = require('express')
const router = express.Router()

const moment = require('moment')
const axios = require('axios')

module.exports = router

router.get('/', (req, res) => {
    const db = req.db
    if (typeof req.cookies['auth._token.google'] == 'undefined') {
        res.send({
            status: false,
            msg: 'No Token'
        })
    } else {
        const token = req.cookies['auth._token.google'].replace('Bearer ', '')
        axios.get('https://accounts.google.com/o/oauth2/revoke', {
            params: {
                token: token
            }
        }).then( async resp=>{
            await db.prepare('update staff set Token=NULL, TokenExpire=NULL where Token=?').bind(token).run()
            res.send({
                status: true,
                msg: 'Revoked'
            })
        }).catch(err=>{
            res.send({
                status: true,
                msg: 'Aready Revoked'
            })
        })
    }
})