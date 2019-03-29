const express = require('express')
const router = express.Router()

const axios = require('axios')

const moment = require('moment')

module.exports = router

router.get('/', async (req, res) => {
    const db = req.db
    if (req.cookies['auth._token.google'] === undefined) {
        res.send({
            status: false,
            msg: 'No Token'
        })
    } else {
        const token = req.cookies['auth._token.google'].replace('Bearer ', '')
        const data = await db.prepare('select * from staff where Token = ?').bind(token).get()
        if (data != null) {
            if (moment(data.TokenExpire).diff(moment()) > 0) {
                res.send({
                    status: true,
                    Email: data.Email,
                    expire: data.TokenExpire,
                    level: data.Level
                })
            } else {
                res.send({
                    status: false,
                    msg: 'Token Expire'
                })
            }
            return
        }
        axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
            params: {
                access_token: token
            }
        }).then(async resp => {
            const expire = moment().add(resp.data.expires_in, 'seconds').format(moment().ISO_8601)
            const row = await db.prepare('select * from staff where Email = ?').bind(resp.data.email).get()
            if (row === undefined) {
                res.send({
                    status: false,
                    msg: 'Unauthorized user'
                })
            } else {
                await db.prepare('update staff set Token=?, TokenExpire=? where Email=?').bind([
                    token,
                    expire,
                    resp.data.email
                ]).run()
                await db.prepare('insert into login_log (Email, LoginTime, IP) VALUES (?,?,?)').bind([
                    resp.data.email,
                    moment().format(moment().ISO_8601),
                    req.realip
                ]).run()
                res.send({
                    status: true,
                    Email: resp.data.email,
                    expire: expire,
                    level: row.Level
                })
            }
        }).catch(async err => {
            if (err.response.status >= 400 && err.response.status < 500) {
                await db.prepare('update staff set Token=NULL, TokenExpire=NULL where Token=?').bind(token).run()
                res.send({
                    status: false,
                    msg: err.response.data.error_description
                })
            } else {
                res.send({
                    status: false,
                    msg: 'Cannot Connect with Google'
                })
            }
        })
    }
})