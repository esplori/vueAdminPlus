import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "./assets/styles/index.scss";

const app = createApp(App);
app.use(ElementPlus,{size:"default"});
app.use(createPinia());
app.use(router);

app.mount("#app");
