import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./assets/styles/index.scss";

const app = createApp(App);
app.use(ElementPlus, { size: "default", locale: zhCn });
app.use(createPinia());
app.use(router);

app.mount("#app");
