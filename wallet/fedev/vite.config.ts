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
})
