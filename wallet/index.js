const express = require('express');
const { server_port } = require('./settings')
const anywebWallet = require('./anyweb-wallet')

const app = express();

const memory = {
    count: 0
}

var wallet = null;

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

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.get('/test', (req, res) => {
    memory.count += 1
    res.json(SuccResponse(`you have requested ${memory.count} times`))
});

app.get('/init', (req, res) => {
    if (wallet === null) {
        res.json(ErrorResponse('没有钱包'))
    }
    else {
        res.json(SuccResponse(''))
    }
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
        wallet = new anywebWallet.AnywebWallet(seed);
        res.json(SuccResponse(''))
    }
});

app.get('/data', (req, res) => {
    if (wallet === null) {
        res.json(ErrorResponse(''))
    }
    else {
        res.json(SuccResponse({
            mpri: wallet.Mpri,
            mpub: wallet.Mpub,
            seed: wallet.seed,
        }))
    }
});

app.use(express.static('static'));

app.listen(server_port, () => {
    console.log(`Serving on http://localhost:${server_port}`);
});