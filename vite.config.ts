import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: './', // 当前目录
  server: {
    host: "127.0.0.1",
    port: 7910,
    open:true, // 默认打开浏览器
    proxy: {
      "/manage-service": {
        target: "https://admin.dsiab.com",
        // target: 'http://localhost:8083/',
        changeOrigin: true,
        // rewrite: path => path.replace('manage-service', '')
      },
    },
    // hmr:{
    //   overlay: false
    // }
  },
});
