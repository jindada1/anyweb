const express = require('express');
const { server_port } = require('./settings')
const anywebWallet = require('./anyweb-wallet')

const app = express();
app.use(express.json())

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

var wallet = new anywebWallet.AnywebWallet();

function ErrorResponse(message) {
    return {
        code: 0,
        message,
        data: '',
    }
}

function SuccResponse(data) {
    return {
        code: 200,
        message: 'success',
        data,
    }
}

const memory = {
    count: 0
}
app.get('/test', (req, res) => {
    memory.count += 1
    res.json(SuccResponse(`you have requested ${memory.count} times`))
});

function tryGet(value, error) {
    return wallet.ready ? SuccResponse(value) : ErrorResponse(error);
}

const ERR_MSG_WALLET_EMPTY = 'The wallet has not been initialized'

app.get('/init', (req, res) => {
    res.json(tryGet(wallet.configurations, ERR_MSG_WALLET_EMPTY))
});


app.get('/seed/gen', (req, res) => {
    const { sentence } = req.query;
    if (sentence === undefined) {
        res.json(ErrorResponse('sentence can not be empty'))
    }
    else {
        res.json(SuccResponse(anywebWallet.generateSeed(sentence)))
    }
});

app.get('/seed/confirm', (req, res) => {
    const { seed } = req.query;
    if (seed === undefined) {
        res.json(ErrorResponse('seed can not be empty'))
    }
    else {
        wallet.createFromSeed(seed)
        res.json(tryGet(wallet.masterKeys, `failed to init wallet with seed: ${seed}`))
    }
});

app.get('/data/wallet', (req, res) => {
    res.json(tryGet(wallet.masterKeys, ERR_MSG_WALLET_EMPTY))
});

app.post('/di/create', (req, res) => {
    const { name } = req.body;
    if (name === undefined) {
        res.json(ErrorResponse('name can not be empty'))
    }
    res.json(tryGet(wallet.createDI(name), ERR_MSG_WALLET_EMPTY))
});

app.get('/di/list', (req, res) => {
    res.json(tryGet(wallet.identities, ERR_MSG_WALLET_EMPTY))
});

app.get('/di/detail', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        res.json(ErrorResponse('name can not be empty'))
    }
    res.json(tryGet(wallet.getDI(name), ERR_MSG_WALLET_EMPTY))
});


app.post('/da/create', (req, res) => {
    const { di, name, puid, ppk } = req.body;
    if (di === undefined) {
        res.json(ErrorResponse('di can not be empty'))
    }
    if (name === undefined) {
        res.json(ErrorResponse('name can not be empty'))
    }
    if (puid === undefined) {
        res.json(ErrorResponse('puid can not be empty'))
    }
    if (ppk === undefined) {
        res.json(ErrorResponse('ppk can not be empty'))
    }
    res.json(tryGet(wallet.createDA(di, name, puid, ppk), ERR_MSG_WALLET_EMPTY))
});

app.get('/da/list', (req, res) => {
    const { di } = req.query;
    if (di === undefined) {
        res.json(ErrorResponse('di can not be empty'))
    }
    res.json(tryGet(wallet.getAccounts(di), ERR_MSG_WALLET_EMPTY))
});

app.get('/da/detail', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        res.json(ErrorResponse('name can not be empty'))
    }
    res.json(tryGet(wallet.getDI(name), ERR_MSG_WALLET_EMPTY))
});

app.listen(server_port, () => {
    console.log(`Serving on http://localhost:${server_port}`);
});