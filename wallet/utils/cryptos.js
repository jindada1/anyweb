const prikeys = [
    "0xf086cff7f8f85b80d33aa34eb1f912407b613a63aaede6ff996ae79e037ed7a7",
    "0xccbd180f02d4ab3a824343d5d17cd408ca68b72d19a4a779386190fcac4c562d",
    "0xb99a4547a5c9a8e0af80b773ad0845042f2a781658289f1df05ea45e3ce25b0d",
    "0x7420c9c0b000b315908b7c41aa40c3f16f93a723b0ecd1749f27b7967ff04051",
    "0x2515b67a2cb7620c5a739807000afd585f0e5af966c69c2b8482e76caae71c77",
    "0x483c09f1534f19d3cb36a7190ac416d335387512eb24435b50e27a0d6f813f8b",
    "0x476937255b66dde9b1b9041364534da3770626cdbff3f1e11fee7f2f5a1e63e1",
    "0x5ff0422bd4e1573016d3c368bab8f0f4713c80e8807ee917ce59ff513a723c64",
    "0x5435a572d7c6bf2c1b016ba47d666fd98e7fdd07a123312fcf88ba1a67a9081c",
    "0xf822ccafd7e18820953aa71189b95b8e6f04d8e7be522a81c6f65a1e03d6f821",
]

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
const asciiToHex = function (str) {
    if (!str)
        return "0x00";
    var hex = "";
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return hex;
};

var dec2utf8 = function (arr) {
    if (typeof arr === 'string') {
        return arr;
    }

    var unicodeString = '', _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2);
        var v = one.match(/^1+?(?=0)/);

        if (v && one.length === 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);

            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2)
            }

            unicodeString += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            unicodeString += String.fromCharCode(_arr[i]);
        }
    }
    return unicodeString
};

const hex2ascii=function(hexx) {
    var hex = hexx.toString();//force conversion
    
    var str_list = [];
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str_list.push(parseInt(hex.substr(i, 2), 16));
    
    return dec2utf8(str_list);
}


/**
 * Should be called to get hex representation (prefixed by 0x) of decimal number string
 *
 * @method decToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
const decToHex = function (str) {
    var dec = str.toString().split(''), sum = [], hex = ["0x"], i, s
    while (dec.length) {
        s = 1 * dec.shift()
        for (i = 0; s || i < sum.length; i++) {
            s += (sum[i] || 0) * 10
            sum[i] = s % 16
            s = (s - sum[i]) / 16
        }
    }
    while (sum.length) {
        hex.push(sum.pop().toString(16))
    }
    return hex.join('')
}

var crypto = require("crypto");

/**
 * Generate random bytes and format to hex
 *
 * @method randomBytes
 * @param {Number} byteLen byte length of random hex string
 * @returns {String} hex string
 */
const randomBytes = function (byteLen = 32) {
    var hex = crypto.randomBytes(byteLen).toString('hex');
    return "0x" + hex;
};


keccak256 = require('js-sha3').keccak256;

/**
 * Convert a hex string to an ArrayBuffer.
 * https://gist.github.com/don/871170d88cf6b9007f7663fdbc23fe09
 * 
 * @param {string} hexString - hex representation of bytes.
 * @return {Array} - Array of integers.
 */
function hexStringToArray(hexString) {
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, '');

    // ensure even number of characters
    if (hexString.length % 2 != 0) {
        console.log('WARNING: expecting an even number of characters in the hexString');
    }

    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);
    }

    // split the string into pairs of octets
    var pairs = hexString.match(/[\dA-F]{2}/gi);

    // convert the octets to integers
    return pairs.map((s) => parseInt(s, 16));

}


/**
 * Keccak256 hash function
 *
 * @method keccak256Hash
 * @param {Array} hex array of hex Str
 * @returns {String}  hexStr, 0x------
 */
const keccak256Hash = function (hexes) {
    let integers = []

    for (const hex of hexes) {
        integers = integers.concat(hexStringToArray(hex))
    }
    
    return "0x" + keccak256(new Uint8Array(integers));
};


/**
 * xor message with key
 *
 * @method XOR
 * @param {String} msg hex message
 * @param {String} key hex string
 * @returns {String}  hex string
 */
const XOR = function (msg, key) {

    const msgBuf = Buffer.from(msg.slice(2).padStart(64, '0'), 'hex');
    const keyBuf = Buffer.from(key.slice(2), 'hex');

    const resultBuf = keyBuf.map((bit, i) => bit ^ msgBuf[i]);

    return "0x" + BigInt("0x" + resultBuf.toString('hex')).toString(16);
};

const secp256k1 = require('./secp256k1')

function toPoint(pk) {
    return [
        '0x' + pk.slice(0, 64),
        '0x' + pk.slice(64),
    ]
}

/**
 * ?????????????????????????????? x ???
 * @param {String} pk ????????????????????????????????????x | y
 * @param {String} n ?????????????????????
 */
function ECCMul(pk, n) {
    if (pk.startsWith('0x')) {
        pk = pk.slice(2)
    }
    if (!n.startsWith('0x')) {
        n = '0x' + n
    }
    return secp256k1.mulPoint(toPoint(pk), n)
}

/**
 * ?????????????????????????????? + ???
 * @param {Array} M ????????? [x, y]
 * @param {Array} N ????????? [x, y]
 */
function ECCAdd(M, N) {
    return secp256k1.addPoints(M, N)
}

const EthCrypto = require('eth-crypto')

function pkPointToStr(point) {
    return point[0].slice(2) + point[1].slice(2)
}

/**
 * ????????????
 * @param {String} pkStr ???????????????
 * @returns ?????????????????????????????????
 */
function compressPKStr(pkStr) {
    // ?????? 0x
    if (pkStr.startsWith('0x')) {
        pkStr = pkStr.slice(2)
    }
    return EthCrypto.publicKey.compress(pkStr)
}

/**
 * ?????????????????????
 * @param {Array} pkPoint ???????????????
 * @returns ?????????????????????????????????
 */
function compressPKPoint(pkPoint) {
    return compressPKStr(pkPointToStr(pkPoint))
}

/**
 * ???????????????
 * @param {Array} pkstr ?????????????????????????????????
 * @returns ???????????????????????????
 */
function decompressPKToPoint(pkstr) {
    const dpkstr = decompressPKToStr(pkstr)
    return toPoint(dpkstr)
}

/**
 * ???????????????
 * @param {Array} pkstr ?????????????????????????????????
 * @returns ?????????????????????????????????
 */
function decompressPKToStr(pkstr) {
    if (pkstr.startsWith('0x')) {
        pkstr = pkstr.slice(2)
    }
    return EthCrypto.publicKey.decompress(pkstr)
}

/**
 * ??????256bits??????????????????????????????????????????
 * @param {String} msg 256bits?????????
 * @returns ??????????????????
 */
function msgToPoint(msg) {
    if (msg.startsWith('0x')) {
        msg = msg.slice(2)
    }
    const pkstr = EthCrypto.publicKey.decompress('03' + msg)
    return toPoint(pkstr)
}

/**
 * ??????????????????
 * @param {Array} PK ??????
 * @param {String} msg ??????????????????
 * @returns ??????
 */
function ECCEnc(PK, msg) {
    let r = randomBytes(32);
    let R = secp256k1.drivePub(r)

    // msg ????????????
    const M = msgToPoint(msg)
    const P = secp256k1.addPoints(secp256k1.mulPoint(PK, r), M)
    
    return {R, P}
}

/**
 * ??????????????????
 * @param {Array} R ?????????????????? [x, y]
 * @param {Array} P ?????????????????? [x, y]
 * @param {String} sk ?????????????????????
 * @returns ????????????
 */
function ECCDec(R, P, sk) {
    const Rsk = secp256k1.mulPoint(R, sk)
    const M = secp256k1.subPoints(P, Rsk)
    return M[0]
}

/**
 * ?????????????????? Uint8 ??????
 * @param {String} string ?????????
 * @returns Uint8Array
 */
function stringToUTF8Bytes(string) {
    return new TextEncoder().encode(string);
}

/**
 * ??????????????????????????????????????????
 * @param {Array} bytes ????????????
 * @returns ?????????????????????
 */
function bytesToHex(bytes) {
    return Array.from(
      bytes,
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
}

/**
 * Schnorr ??????
 * @param {String} sk ?????????hex???
 * @param {String} msg ??????????????????hex???
 * @returns R, s, key
 */
function schnorrSig(sk, msg) {
    const r = randomBytes(32);
    const R = secp256k1.drivePub(r)

    const msgHex = bytesToHex(stringToUTF8Bytes(msg))
    const hash = keccak256Hash([msgHex, ...R])

    if (!sk.startsWith('0x')) {
        sk = '0x' + sk
    }

    const s = secp256k1.eccAddHex(r, secp256k1.eccAddHex(hash, sk))
    return {R, s, hash}
}

module.exports = {
    prikeys,
    decToHex,
    asciiToHex,
    hex2ascii,
    randomBytes,
    keccak256Hash,

    compressPKStr,
    compressPKPoint,
    decompressPKToPoint,
    decompressPKToStr,

    ECCEnc,
    ECCDec,

    ECCMul,
    ECCAdd,

    encrypt: XOR,
    decrypt: XOR,

    schnorrSig,

    bnToHex: (bn) => decToHex(bn.toString()),
    oneAndRightHalf: (str) => "0x1" + str.slice(34),
};