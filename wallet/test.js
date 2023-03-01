const HDWallet = require('ethereum-hdwallet');
var crypto = require('crypto');
var CRC32 = require('crc-32');
const cryptos = require("./utils/cryptos")

const HARDENED_OFFSET = 0x80000000
const HD_MASTER = 'm'

function generateSeed(sentence) {
    var hmac = crypto.createHmac('sha512', 'yweb sso');
    // passing the data to be hashed
    data = hmac.update(sentence);
    // Creating the hmac in the required format
    gen_hmac = data.digest('hex');

    return gen_hmac
}

function routeToCRC32Hex(route) {
    // 每个字符串转换成32位的无符号整数
    const nums = route.split('/').map(UnsignedCRC32);
    return nums.map((n) => n.toString(16)).join("/");
}

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

function routePath(route) {
    console.log(`路  由  为: ${route}`);
    let path = routeToHDPath(route)
    console.log(`派生路径为: ${path}`);
}

function UnsignedCRC32(str) {
    var number = CRC32.str(str);
    if (number < 0) {
        number += 4294967296   // 2^32
    }
    return number
}

function DI(hdwallet, name) {
    const route = `anyweb/${name}`
    const HDPath = routeToHDPath(route)
    const pri = hdwallet.derive(HDPath).getPrivateKey().toString('hex')
    const pub = hdwallet.derive(HDPath).getPublicKey().toString('hex')

    return {
        pri,
        pub,
        name,
        route,
        HDPath,
        log: () => {
            console.log(`数字身份: ${name}`);
            console.log(`  路由为: ${route}`);
            console.log(`  转义后的派生路径为: ${HDPath}`);
            console.log(`  私钥: ${pri}`);
            console.log(`  公钥: ${pub}`);
        }
    }
}

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

function logCase(testcase) {
    console.log("");
    console.log(`【${testcase}】`);
}


logCase("通过助记文本初始化账户钱包，创建种子和主密钥对")
const sentence = "秋水共长天一色"
console.log(`助记语：${sentence}`);

const seed = generateSeed(sentence)
console.log(`种子为：${seed}`);

const wallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'))
const Mpri = wallet.derive(HD_MASTER).getPrivateKey().toString('hex')
const Mpub = wallet.derive(HD_MASTER).getPublicKey().toString('hex')
console.log(`主私钥: ${Mpri}`);
console.log(`主公钥: ${Mpub}`);

logCase("以Shamir（2，3）的方式将种子分为三片秘密，随后通过其中的任意两片秘密恢复到原始种子")
const Shamir = require('./utils/shamir');
const shares = 3
const threshold = 2
const sseeds = Shamir.generateShares(seed, shares, threshold);
console.log(`种子分为以下 ${shares} 片`);
sseeds.forEach((s) => {
    console.log(`  ${s}`);
})
const secretDataHex = Shamir.deriveSecret(sseeds.splice(1));
console.log(`复原的密钥为：${secretDataHex}`);

logCase("将节点路由解析为派生路径")
routePath('/anyweb/test/1')
routePath('/anyweb/test/parse/1')
DI(wallet, 'test/parse/1').log()

logCase("在钱包内创建两个数字身份，名字分别为 Kris 和 Tom ")
const Kris = DI(wallet, 'Kris')
Kris.log()

DI(wallet, 'Tom').log()


logCase("生成一个模拟微信号“lonelywolf”，为其创建对应的数字账号“lonelywolf”，并将其绑定在身份“Kris”下")

function simulatePUID(account) {
    var hmac = crypto.createHmac('sha256', 'yweb sso');
    data = hmac.update(account);
    // Creating the hmac in the required format
    gen_hmac = data.digest('hex');
    return gen_hmac    
}


const secp256k1 = require('./utils/secp256k1')

function DA(hdwallet, DIdentity, account, PUID, PPK) {
    route = `anyweb/${account}`
    const HDPath = routeToHDPath(route)
    const pri = hdwallet.derive(HDPath).getPrivateKey().toString('hex')
    const pub = hdwallet.derive(HDPath).getPublicKey().toString('hex')

    const tokenId = cryptos.keccak256Hash([DIdentity.pub]);
    
    const str1Point = cryptos.ECCMul(DIdentity.pub, PUID);
    const str1 = cryptos.compressPKPoint(str1Point)

    const {R, P} = cryptos.ECCEnc(PPK, PUID);
    
    const str2 = cryptos.compressPKPoint(R) + cryptos.compressPKPoint(P)

    const str3 = cryptos.encrypt(PUID, DIdentity.pri)

    const tokenUri = [str1, str2, str3].join('.')

    return {
        pri,
        pub,
        route,
        HDPath,
        PUID,
        DAID: tokenId,
        tokenUri,
        log: () => {
            console.log(`数字账户：${account}`);
            console.log(`  路由为: ${route}`);
            console.log(`  转义后的派生路径为: ${HDPath}`);
            console.log(`  私钥: ${pri}`);
            console.log(`  公钥: ${pub}`);
            console.log(`  DAID: ${tokenId}`);
            console.log(`  tokenUri: ${str1}.\n ${str2}.\n ${str3}`);
        }
    }
}


const PUID_seed = simulatePUID('lonelywolf');
const PUID = secp256k1.drivePub('0x' + PUID_seed)[0]

console.log(`来自服务商的 PUID: ${PUID}`);
const psk = '0xf086cff7f8f85b80d33aa34eb1f912407b613a63aaede6ff996ae79e037ed7a7'
const PPK = secp256k1.drivePub(psk)
console.log(`服务商的公钥为：${cryptos.compressPKPoint(PPK)}`);
const lonelywolf = DA(wallet, Kris, 'Kris/wechat/lonelywolf', PUID, PPK)
lonelywolf.log()


logCase('生成Kris的数字身份凭证')

function DIVC(DIdentity, declaration) {

    function stringToUTF8Bytes(string) {
        return new TextEncoder().encode(string);
    }
    
    function bytesToHex(bytes) {
        return Array.from(
          bytes,
          byte => byte.toString(16).padStart(2, "0")
        ).join("");
    }
    
    function schnorrSig(sk, msg) {
        const r = randomBytes(32);
        const R = secp256k1.drivePub(r)
    
        const msgHex = bytesToHex(stringToUTF8Bytes(msg))
        const key = cryptos.keccak256Hash([msgHex, ...R])
    
        const s = secp256k1.eccAddHex(r, secp256k1.eccAddHex(key, sk))
        return {R, s, key}
    }

    declaration = JSON.stringify(declaration)
    // 编码声明
    const D = encodeURIComponent(declaration);
    
    const sk = '0x' + DIdentity.pri;
    const sig = schnorrSig(sk, D);

    // const {R, s} = sig;
    // verifySig(toPoint(Kris.pub), R, s, D)

    return {
        ...sig,
        log: () => {
            console.log(`声明为：${declaration}`);
            console.log(`编码声明得：${D}`);
            console.log(`私钥为：${sk}`);
            console.log(`所得凭证是：`);
            console.log(sig);
        }
    }
}

const okDuration = 1000 * 60 * 60 + parseInt(1000 *  Math.random()) // 1 小时 左右 有效期
const KrisVC = DIVC(Kris, {
    exp: Date.now() + okDuration
})
KrisVC.log()


logCase('生成lonelywolf的数字账户凭证')

function DAVC(DAccount, DIcredential, ) {
    const Rpuid = secp256k1.mulPoint(DIcredential.R, DAccount.PUID);
    
    return {
        Rpuid,
        DAID: DAccount.DAID,
        key: DIcredential.key,
        log: () => {
            console.log('账户凭证为：');
            console.log({
                Rpuid,
                DAID: DAccount.DAID,
                key: DIcredential.key,
            });
        }
    }
}

DAVC(lonelywolf, KrisVC).log()
