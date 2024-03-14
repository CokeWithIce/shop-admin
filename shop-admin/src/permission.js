import {router,addRoutes} from"~/router";
import {getToken} from "~/composables/auth.js";
import {toast,showFullLoading,hideFullLoading} from "~/composables/util.js";
import store from "~/store/index.js";
let hasGetInfo=false;
router.beforeEach(async (to, from, next) => {
    showFullLoading();
    const token = getToken();
    if (!token && to.path !== "/login") {
        toast("没有权限哦！亲", "error")
        return next({path: '/login'})
    }
    if (token && to.path == "/login") {
        toast("不可以重复登录哦亲！", "error")
        return next({path: from.path ? from.path : '/'})
    }
    let midVal=false;
    // if use login,autologin
    if (token&& !hasGetInfo) {
        let {menus}=await store.dispatch("getinfo");
        hasGetInfo=true;
        midVal=addRoutes(menus);
    }
    document.title=to.meta.title?to.meta.title:"后台页面";
    midVal?next(to.fullPath):next();
})
router.afterEach(async(to,from,failure)=>{
    hideFullLoading();
})
