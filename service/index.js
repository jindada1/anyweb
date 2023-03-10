const express = require('express')
const helpers = require('./helpers')

const app = express()
const port = 3000

const psk = '0xf086cff7f8f85b80d33aa34eb1f912407b613a63aaede6ff996ae79e037ed7a7';
const PPK = helpers.drivePub(psk);

/**
 * 生成账号的 puid
 */
app.get('/puid', (req, res) => {
    let account = req.query.account
    if (account === undefined) {
        account = 'demo'
    }
    const puid = helpers.genPuid(account)
    res.json({puid, PPK})
})

/**
 * 确认数字账户的创建
 */
app.get('/da/confirm', (req, res) => {
    const {puid} = req.query

    /**
     * should request from smart contract
     */
    let tokenuri = req.query.tokenuri
    if (tokenuri === undefined) {
        tokenuri = '-.0248603e53f58771f797c27c8ad12090361c1e5da01b146631ddb7e7a5252be39d03926d1574ba6d7b12b6bb15786200a089037c32bd4a20867c3465e450f39b97ef.-'
    }
    
    const strs = tokenuri.split('.');
    const dPuid = helpers.decrypt(strs[1], psk)
    
    res.json({valid: dPuid === puid})
})

/**
 * 数字账户的登录验证
 */
app.get('/da/login', (req, res) => {
    let {DAID, Rpuid, key} = req.query

    /**
     * should request from smart contract
     */
    let tokenuri = req.query.tokenuri
    if (tokenuri === undefined) {
        tokenuri = '-.0248603e53f58771f797c27c8ad12090361c1e5da01b146631ddb7e7a5252be39d03926d1574ba6d7b12b6bb15786200a089037c32bd4a20867c3465e450f39b97ef.-'
    }

    s = '';
    D = '';
    
    const strs = tokenuri.split('.');
    const dPuid = helpers.decrypt(strs[1], psk)
    res.json({
        valid: true,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibG9uZWx5d29sZiIsImlhdCI6MTUxNjIzOTAyMn0.K6zcwBVPt3sPBJwdqCwPdDuV2oHp-9kg_PXx0vkdb80'
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})