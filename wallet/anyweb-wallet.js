/**
 * Author: jindada1
 */
const HDWallet = require('ethereum-hdwallet');
const crypto = require('crypto');
const CRC32 = require('crc-32');
const fsHelper = require('./utils/fs-helper')
const cryptos = require("./utils/cryptos")

const SEED_KEY = 'yweb sso';
/**
 * 根据助记语生成种子
 * @param {String} sentence 助记语
 * @returns 种子
 */
const generateSeed = function (sentence) {
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

const HARDENED_OFFSET = 0x80000000
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

const HD_MASTER = 'm'
const BASE_ROUTE = `${HD_MASTER}/anyweb/`;
/**
 * 数字身份钱包
 */
class AnywebWallet {

    #initialized = false; // 私有变量，是否成功初始化的标志位
    #DIs = {}  // 所有的数字身份
    #DAs = []  // 所有的数字账户
    #coreData = {  // 需要数据持久化的关键信息
        seed: '',
        dis: [],
        das: []
    }

    /**
     * 从本地文件初始化钱包
     * @param {String} file 持久化文件路径
     */
    constructor(file = 'wallet.yaml') {
        this.coreDataFile = file;
        this.#fromDisk(file);
    }

    #inited() {
        console.log('[success] init with seed ' + this.seed);
        this.#initialized = true;
    }

    #store() {
        fsHelper.writeYamlFile(this.coreDataFile, this.#coreData);
    }

    #fromDisk(file) {
        const localConfig = fsHelper.readYamlFile(file)
        // 不存在已有配置
        if (!localConfig) {
            return;
        }

        // 根据种子初始化
        const error = this.#fromSeed(localConfig.seed)
        if (error) {
            return error
        }

        this.#coreData = localConfig;
        // 构建数字身份
        this.#coreData.dis.map((name) => {
            this.#createDI(name)
        });

        // 构建数字账户
        this.#coreData.das.map((da) => {
            const { DIName, DAName, PUID, PPK } = da;
            this.#createDA(DIName, DAName, PUID, PPK)
        })
    }

    #fromSeed(seed) {
        try {
            this.seed = seed;
            this.instance = HDWallet.fromSeed(Buffer.from(seed, 'hex'))
            this.Mpri = this.instance.derive(HD_MASTER).getPrivateKey().toString('hex')
            this.Mpub = this.instance.derive(HD_MASTER).getPublicKey().toString('hex')
            this.#inited();
            return false
        } catch (error) {
            return error
        }
    }

    #createDI(name) {
        // 检查是否已经创建了
        if (this.#DIs[name]) {
            return false
        }
        const route = `${BASE_ROUTE}${name}`;
        const { node, path } = this.derive(route);
        const pri = node.getPrivateKey().toString('hex')
        const pub = node.getPublicKey().toString('hex')
        const di = {
            name,
            route,
            path,
            pri,
            pub
        }
        // 将身份加入钱包
        this.#DIs[name] = di;
        return di;
    }

    #createDA(DIName, DAName, PUID, PPK) {
        // 确保本地已创建名为 DIName 的数字身份
        const DI = this.#DIs[DIName]
        if (DI === undefined) {
            return false
        }

        const route = `${BASE_ROUTE}${DIName}/${DAName}`
        const { node, path } = this.derive(route);

        const pri = node.getPrivateKey().toString('hex')
        const pub = node.getPublicKey().toString('hex')

        const tokenId = cryptos.keccak256Hash([DI.pub]);

        const str1Point = cryptos.ECCMul(DI.pub, PUID);
        const str1 = cryptos.compressPKPoint(str1Point)

        // 解压回坐标点
        PPK = cryptos.decompressPKToPoint(PPK)
        const { R, P } = cryptos.ECCEnc(PPK, PUID);
        const str2 = cryptos.compressPKPoint(R) + cryptos.compressPKPoint(P)

        const str3 = cryptos.encrypt(PUID, DI.pri)

        const tokenUri = [str1, str2, str3].join('.')

        const da = {
            di: DIName,
            pri,
            pub,
            name: DAName,
            route,
            path,
            PUID,
            DAID: tokenId,
            tokenUri,
        }
        this.#DAs.push(da)
        return da;
    }

    /**
     * 根据种子创建钱包
     * @param {String} seed 十六进制的字符串
     */
    createFromSeed(seed) {
        const error = this.#fromSeed(seed)
        console.log(error);
        if (!error) {
            // 持久化关键数据
            this.#coreData.seed = this.seed
            this.#store()
        }
        return error
    }

    /**
     * 获取常量配置
     */
    get configurations() {
        return {
            baseRoute: BASE_ROUTE,
            masterKey: HD_MASTER
        }
    };

    /**
     * 获取根密钥对以及种子
     */
    get masterKeys() {
        return {
            seed: this.seed,
            mpri: this.Mpri,
            mpub: this.Mpub,
        }
    };

    /**
     * 获取所有数字身份
     */
    get identities() {
        return Object.values(this.#DIs);
    };

    /**
     * 是否就绪
     */
    get ready() {
        return this.#initialized;
    };

    /**
     * 节点派生
     * @param {String} route 节点路由
     * @returns 对应的HD 路径以及相应的节点
     */
    derive(route) {
        if (!this.#initialized) {
            return false;
        }
        const HDPath = routeToHDPath(route)
        return {
            path: HDPath,
            node: this.instance.derive(HDPath)
        }
    }

    /**
     * 创建数字身份
     * @param {String} name 数字身份名
     * @returns 数字身份
     */
    createDI(name) {
        if (!this.#initialized) {
            return false;
        }
        const di = this.#createDI(name)
        if (di) {
            // 持久化
            this.#coreData.dis.push(name)
            this.#store();
        }
        return di
    }

    /**
     * 获取数字身份信息
     * @param {String} name 数字身份名
     * @returns 数字身份详细信息
     */
    getDI(name) {
        if (!this.#initialized) {
            return false;
        }
        return this.#DIs[name];
    }

    /**
     * 获取数字身份下所有的数字账户
     * @param {String} DIName 数字身份名
     * @returns 数字账户列表
     */
    getAccounts(DIName) {
        if (!this.#initialized) {
            return false;
        }
        return this.#DAs.filter((da) => da.di === DIName)
    }

    /**
     * 创建数字账户
     * @param {String} DIName 数字身份名
     * @param {String} DAName 数字账户名
     * @param {String} PUID   线下账户登录授权码
     * @param {String} PPK    服务商公钥（压缩后的）
     * @returns 
     */
    createDA(DIName, DAName, PUID, PPK) {
        if (!this.#initialized) {
            return false;
        }
        const da = this.#createDA(DIName, DAName, PUID, PPK)
        if (da) {
            // 持久化
            this.#coreData.das.push({ DIName, DAName, PUID, PPK })
            this.#store();
        }
        return da
    }
}

module.exports = {
    seedKey: SEED_KEY,
    generateSeed,
    routeToHDPath,
    AnywebWallet
};