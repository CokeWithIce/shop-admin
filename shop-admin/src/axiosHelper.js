import axios from "axios";
import {toast} from "~/composables/util.js";
import {getToken,setToken} from "~/composables/auth.js";
import {useRouter} from "vue-router";
import store from "~/store/index.js";
const service=axios.create({
    baseURL:'/api'
})
const router=useRouter();
let token;
service.interceptors.request.use(function(config){
    token=getToken()
    if(token){
        config.headers["token"]=token;
    }
    return config;
},function(error){
    return Promise.reject(error)
});
service.interceptors.response.use(function(response){
    if((!token||token=="undefined")&&response.data.data.token){
        setToken(response.data.data.token);
        token=getToken();
        console.log(token);
    }else if(!token&&!response.data.data.token){
        toast("登录超时请重新登录", "error",);
        router.push("/login");
        return "";
    }
    return response.data.data;
},function(error){
    if(error.response.data.msg=="非法token，请先登录！"){
        store.dispatch("logout").finally(()=>location.reload());
    }
    toast(error.response.data.msg||"请求失败", "error",)
    return Promise.reject(error)
});
export default service;