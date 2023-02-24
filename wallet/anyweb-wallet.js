/**
 * Author: jindada1
 */
const HDWallet = require('ethereum-hdwallet');
const crypto = require('crypto');
const CRC32 = require('crc-32');

const SEED_KEY = 'yweb sso';
const HARDENED_OFFSET = 0x80000000
const HD_MASTER = 'm'

/**
 * 根据助记语生成种子
 * @param {String} sentence 助记语
 * @returns 种子
 */
const generateSeed = function(sentence) {
    var hmac = crypto.createHmac('sha512', SEED_KEY);
    // passing the data to be hashed
    data = hmac.update(sentence);
    // Creating the hmac in the required format
    gen_hmac = data.digest('hex');

    return gen_hmac
}

/**
 * 返回字符串的CRC32哈希
 * @param {String} str 字符串
 * @returns 无符号整型的 32bits
 */
function UnsignedCRC32(str) {
    var number = CRC32.str(str);
    if (number < 0) {
        number += 4294967296   // 2^32
    }
    return number
}

/**
 * 将密钥路由解析为派生路径
 * @param {String} route 密钥路由
 * @returns 派生路径
 */
function routeToHDPath(route) {
    // 每个字符串转换成32位的无符号整数
    const nums = route.split('/').map(UnsignedCRC32);
    if (nums.length === 0) {
        return HD_MASTER
    }
    return `${HD_MASTER}/` + nums.map(n =>
        n % HARDENED_OFFSET    // 不超过 2^31
    ).join("/");
}

class AnywebWallet {
    constructor(seed) {
        this.seed = seed;
        this.instance = HDWallet.fromSeed(Buffer.from(seed, 'hex'))
        this.Mpri = this.instance.derive(HD_MASTER).getPrivateKey().toString('hex')
        this.Mpub = this.instance.derive(HD_MASTER).getPublicKey().toString('hex')
    }
}


module.exports = {
    seedKey: SEED_KEY,
    generateSeed,
    routeToHDPath,
    AnywebWallet
};