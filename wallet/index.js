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

/**
 * 检查参数体是否缺少字段
 * @param {Object} obj 参数体
 * @param {Array} fields 字段列表
 */
function checkFields(obj, fields) {
    fields.forEach(field => {
        if (obj[field] === undefined && obj[field] === '') {
            return `${field} can not be empty`
        }
    })
    return {
        err: false,
        ...obj
    }
}

const ERR_MSG_WALLET_EMPTY = 'The wallet has not been initialized'

app.get('/init', (req, res) => {
    res.json(tryGet(wallet.configurations, ERR_MSG_WALLET_EMPTY))
});


app.get('/seed/gen', (req, res) => {
    const { err, sentence } = checkFields(req.query, ['sentence'])
    const resp = err ? ErrorResponse(err) : SuccResponse(anywebWallet.generateSeed(sentence));
    res.json(resp)
});

app.get('/seed/confirm', (req, res) => {
    const { err, seed } = checkFields(req.query, ['seed'])
    if (err) {
        res.json(ErrorResponse(err))
        return;
    }
    wallet.createFromSeed(seed);
    res.json(tryGet(wallet.masterKeys, `failed to init wallet with seed: ${seed}`));
});

app.get('/data/wallet', (req, res) => {
    res.json(tryGet(wallet.masterKeys, ERR_MSG_WALLET_EMPTY));
});

app.post('/di/create', (req, res) => {
    const { err, name } = checkFields(req.body, ['name']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.createDI(name), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.get('/di/list', (req, res) => {
    res.json(tryGet(wallet.identities, ERR_MSG_WALLET_EMPTY));
});

app.get('/di/detail', (req, res) => {
    const { err, name } = checkFields(req.query, ['name']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.getDI(name), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.post('/di/auth', (req, res) => {
    const { err, di, declaration } = checkFields(req.body, ['di', 'declaration']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.authDI(di, declaration), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.get('/di/vcs', (req, res) => {
    const { err, di } = checkFields(req.query, ['di']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.getDIVCs(di), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.get('/di/vc', (req, res) => {
    const { err, di } = checkFields(req.query, ['di']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.getDIVC(di), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.post('/da/create', (req, res) => {
    const { err, di, name, puid, ppk } = checkFields(req.body, ['di', 'name', 'puid', 'ppk']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.createDA(di, name, puid, ppk), ERR_MSG_WALLET_EMPTY)
    res.json(resp);
});

app.get('/da/list', (req, res) => {
    const { err, di } = checkFields(req.query, ['di']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.getAccounts(di), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.get('/da/detail', (req, res) => {
    const { err, daid } = checkFields(req.query, ['daid']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.getDA(daid), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.post('/da/auth', (req, res) => {
    const { err, daid } = checkFields(req.body, ['daid']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.authDA(daid), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.get('/da/vc', (req, res) => {
    const { err, daid } = checkFields(req.query, ['daid']);
    const resp = err ? ErrorResponse(err) : tryGet(wallet.getDAVC(daid), ERR_MSG_WALLET_EMPTY);
    res.json(resp);
});

app.listen(server_port, () => {
    console.log(`Serving on http://localhost:${server_port}`);
});