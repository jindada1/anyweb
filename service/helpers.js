var crypto = require('crypto');
const EthCrypto = require('eth-crypto');
const secp256k1 = require('./secp256k1');

/**
 * 返回输入字符串的 HMAC-SHA256 哈希结果
 * @param {String} str 字符串
 * @returns 256 bits 的哈希
 */
function hmacSha256(str) {
    var hmac = crypto.createHmac('sha256', 'yweb sso');
    data = hmac.update(str);
    // Creating the hmac in the required format
    gen_hmac = data.digest('hex');
    return gen_hmac    
}

/**
 * 生成 PUID
 * @param {String} account 账号
 */
const genPuid = function (account) {
    const seed = hmacSha256(account);
    return secp256k1.drivePub('0x' + seed)[0]
}


function toPoint(pk) {
    return [
        '0x' + pk.slice(0, 64),
        '0x' + pk.slice(64),
    ]
}

/**
 * 椭圆曲线加密的解密过程
 * @param {String} secret 密文
 * @param {String} sk 私钥
 * @returns 明文
 */
function decrypt(secret, sk) {
    const r = EthCrypto.publicKey.decompress(secret.slice(0, 66))
    const p =EthCrypto.publicKey.decompress(secret.slice(66))
    
    const Rsk = secp256k1.mulPoint(toPoint(r), sk)
    const M = secp256k1.subPoints(toPoint(p), Rsk)
    return M[0]
}

module.exports = {
    genPuid,
    drivePub: secp256k1.drivePub,
    decrypt
};