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
  server: {
    host: "127.0.0.1",
    port: 7910,
    open:true, // 默认打开浏览器
    proxy: {
      "/bootService": {
        target: "http://admin.dsiab.com/",
        // target: 'http://localhost:8091/',
        changeOrigin: true,
      },
    },
    // hmr:{
    //   overlay: false
    // }
  },
});
