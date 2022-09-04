import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from "element-plus"
import './assets/styles/index.scss'
import JsonView from "vue-json-viewer"

const app = createApp(App)
app.use(JsonView)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
