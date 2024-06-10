import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// 配置Vite的开发环境
// https://vitejs.dev/config/
export default defineConfig({
  // 使用的插件列表
  plugins: [vue(), vueJsx()],
  // 解析模块路径的配置
  resolve: {
    // 设置别名为"@", 指向src目录
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // 应用的基础路径
  base: "./", // 当前目录
  // 服务器配置
  server: {
    // 服务器绑定的IP地址
    host: "127.0.0.1",
    // 服务器监听的端口号
    port: 7910,
    // 启动服务器时是否自动打开浏览器
    open: true, // 默认打开浏览器
    // 配置代理以转发请求
    proxy: {
      // 配置对/manage-service路径的请求进行代理
      "/manage-service": {
        target: "https://admin.dsiab.com",
        // target: "http://localhost:8093/",
        changeOrigin: true,
        // rewrite: (path) => path.replace("manage-service", ""),
      },
      // 配置对/promote-service路径的请求进行代理
      "/promote-service": {
        target: 'http://localhost:8095/',
        changeOrigin: true,
        rewrite: path => path.replace('promote-service', '')
      },
    },
  },
  // 构建配置
  build: {
    // 配置Rollup的输出选项
    rollupOptions: {
      output: {
        // 自定义如何分割输出的代码块
        manualChunks: {
          "vue-router": ["vue-router"],
          'vue': ["vue"],
          'echarts': ["echarts"],
          'wangeditor': ["@wangeditor/editor"],
          "@wangeditor-editorforvue": ["@wangeditor/editor-for-vue"],
          'axios': ["axios"],
          "element-plus": ["element-plus"],
        },
        // 配置输出的文件名格式
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});