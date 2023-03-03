# 密钥钱包

用于管理用户密钥，同时与区块链进行交互的客户端

## 架构

客户端的实现采用 C/S 架构，依赖 nodejs 运行环境，开发时各个依赖的版本如下

| 环境 | 版本    |
| ---- | ------- |
| node | 16.13.1 |
| pnpm | 7.28.0  |

钱包的所有功能在 Server 端实现，同时提供了图形化的界面（Client）供用户使用。

+ Client：源码在 `/fedev` 下，是一套标准的 web 前端。开发完毕后将产物打包至 `/static` 目录下
+ Server：除去前端源码 `/fedev` 和打包产物 `/static` 外，本目录均为 Server 部分。与 UI 的交互基于标准的 web 通信（http）实现



## Server 端

钱包的核心实现见 `anyweb-wallet.js`，核心类为：**AnywebWallet**。

> 用户可基于此类自行扩展开发更符合自己需求的钱包。

### 说明

服务基于框架 `express` 实现，暴露了以下 api 接口：

| 路由          | 方式 | 说明                                     |
| ------------- | ---- | ---------------------------------------- |
| /             | GET  | 静态资源（前端）路径                     |
| /test         | GET  | 用于测试                                 |
| /init         | GET  | 获取钱包初始化前的基础配置信息           |
| /seed/gen     | GET  | 生成种子                                 |
| /seed/confirm | GET  | 确认使用种子初始化钱包                   |
| /data/wallet  | GET  | 钱包的基础数据                           |
| /di/create    | POST | 创建数字身份                             |
| /di/list      | GET  | 数字身份列表                             |
| /di/detail    | GET  | 数字身份详情                             |
| /di/auth      | POST | 数字身份认证，用于创建凭证               |
| /di/vcs       | GET  | 获取数字身份创建过的所有凭证             |
| /di/vc        | GET  | 获取数字身份当前使用（最近创建的）的凭证 |
| /da/create    | POST | 创建数字账户                             |
| /da/list      | GET  | 某个数字身份下所有的数字账户             |
| /da/detail    | GET  | 某个数字账户的详细信息                   |

### 运行

**安装所需依赖**

``` bash
$ pnpm install
```

**启动**

``` bash
$ pnpm start
```

首次启动时，如果成功则会在终端看到如下反馈：

```powershell
PS F:\Projects\anyweb\wallet> pnpm start

> wallet@1.0.0 start F:\Projects\anyweb\wallet
> node ./index.js

secp256k1 unavailable, reverting to browser version
[info] this wallet has not been initialized
Serving on http://localhost:6000
```

浏览器进入 `http://localhost:6000` 即可使用钱包

**注意：使用默认的图形界面时，请确保 `/static` 目录下是完整的前端静态资源。**

> 如果目录为空或这没有这个目录，请将 `/fedev` 中的源码打包（具体操作方式见 `/fedev/README` ）



**调试模式运行**

启动 express（4.18.2）的 DEBUG 模式

``` bash
$ pnpm debug
```



## Client 端

见 `/fedev/README`

