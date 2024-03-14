import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import ElementPlus from'element-plus';
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {router} from './router';
import store from "~/store/index.js";
import "./permission"
import "nprogress/nprogress.css"
import permission from "~/directives/permission.js";
const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus);
app.use(router);
app.use(store);
app.use(permission)
app.mount('#app');
