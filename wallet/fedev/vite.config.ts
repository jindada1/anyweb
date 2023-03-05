import { resolve } from 'path'
import { defineConfig } from 'vite'
import { server_port } from "../settings";  // 本地后端的端口
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // 打包后的根路径
  // base: "/fe",
  build: {
    outDir: '../static'
  },
  server: {
    proxy: {
      "/dev": {
        target: `http://localhost:${server_port}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/dev/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // all less variables could be found in:
        // https://github.com/vueComponent/ant-design-vue/blob/main/components/style/themes/default.less
        modifyVars: {
          "primary-color": "#000000",
          // "link-color": "#0057a8",
          // "select-item-selected-bg": "#AAAAAA",
        },
        javascriptEnabled: true,
      },
    },
  },
})
