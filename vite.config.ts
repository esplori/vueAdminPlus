import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// element-plus 按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: './', // 当前目录
  server: {
    host: "127.0.0.1",
    port: 7910,
    open: true, // 默认打开浏览器
    proxy: {
      "/manage-service": {
        target: "https://admin.dsiab.com",
        // target: 'http://localhost:8083/',
        changeOrigin: true,
        // rewrite: path => path.replace('manage-service', '')
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-router': ['vue-router'],
          'vue': ['vue'],
          'echarts': ['echarts'],
          'countupjs': ['countup.js'],
          'wangeditor': ['@wangeditor/editor'],
          '@wangeditor-editorforvue': ['@wangeditor/editor-for-vue'],
          'axios': ['axios'],
          'element-plus': ['element-plus'],
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    }
  }
});
