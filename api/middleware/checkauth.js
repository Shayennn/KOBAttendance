const moment = require('moment')

async function CheckAuth( req, res, next ){
    const db = req.db
    const token = req.cookies['auth._token.google'].replace('Bearer ', '')
    const data = await db.prepare('select * from staff where Token = ?').bind(token).get()
    if (data != null) {
        if (moment(data.TokenExpire).diff(moment()) <= 0) {
            res.send({
                status: false,
                msg: 'Token Expire'
            })
        }else{
            req.auth = data
            next()
        }
    }else{
        res.send({
            status: false,
            msg: 'Permission Denied'
        })
    }
}

module.exports = CheckAuth