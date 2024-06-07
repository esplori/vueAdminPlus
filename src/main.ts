// 导入Vue应用的创建函数
import { createApp } from "vue";
// 导入Pinia用于状态管理
import { createPinia } from "pinia";
// 导入应用的主组件
import App from "./App.vue";
// 导入Vue Router用于路由管理
import router from "./router";
// 导入Element Plus UI库
import ElementPlus from "element-plus";
// 导入Element Plus的中文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 引入项目自定义样式
import "./assets/styles/index.scss";

// 创建Vue应用实例
const app = createApp(App);

// 使用Element Plus UI库，并配置默认的尺寸和语言
app.use(ElementPlus, { size: "default", locale: zhCn });
// 使用Pinia进行状态管理
app.use(createPinia());
// 使用Vue Router进行路由管理
app.use(router);

// 将应用实例挂载到HTML元素上
app.mount("#app");