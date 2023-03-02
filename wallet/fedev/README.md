## 密钥钱包-前端

技术栈：Vue 3 + Typescript + Vite + [Antd-Vue](https://antdv.com/docs/vue/introduce)

开发工具：[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### 运行

**安装所需依赖**

``` bash
$ pnpm install
```

**启动开发服务**

``` bash
$ pnpm run dev
```

### 打包

开发完毕后，需要将前端打包成静态文件，便于服务端返回给浏览器

``` bash
$ pnpm run build
```

相关配置在 `vite.config.ts` 里，如下所示，打包产物会放在上一级目录下的 `static` 里

```ts
build: {
  outDir: '../static'
},
```
