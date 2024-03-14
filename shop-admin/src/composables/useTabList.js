
import {ref} from 'vue'
import {Select} from '@element-plus/icons-vue'
import {useRoute,onBeforeRouteUpdate} from"vue-router";
import {router} from "~/router"
import { useCookies } from '@vueuse/integrations/useCookies'
export function useTabList(){
    const cookie=useCookies();
    const route =useRoute();
    const activeName = ref(route.fullPath);
    const tabList = ref([
        {
            title: '后台首页',
            path:'/'
        }
    ])
    const addTab=(tab)=>{
        let noTab=tabList.value.findIndex(t=>t.path==tab.path)==-1;
        if(noTab){
            tabList.value.push(tab)
        }
        cookie.set("tabList",tabList.value)
    }

    onBeforeRouteUpdate((to,from)=>{
        activeName.value=to.path;
        addTab({
            title:to.meta.title,
            path:to.path,
        })
    })
    const changeTab=(t)=>{
        activeName.value=t;
        router.push(t);
    }
    const removeTab=(t)=>{
        let tabs=tabList.value;
        let a=activeName.value;
        console.log(activeName.value);
        if(a==t){
            tabs.forEach((tab,index)=>{
                if(tab.path==t){
                    const nextTab=tabs[index+1]?tabs[index+1]:tabs[index-1];
                    if(nextTab){
                        a=nextTab.path;
                    }
                }
            })
            router.push(a)
            //     因为使用activeName跳转不管用了。所以手动添加一个跳转
        }
        activeName.value=a;
        console.log(activeName.value);
        tabList.value=tabList.value.filter(tab=>tab.path!=t);
        cookie.set("tabList",tabList.value);
    }
    const handleClose = (c)=>{
        if(c=="clearAll"){
            activeName.value='/';
            tabList.value=[{
                title: '后台首页',
                path:'/'
            }]
            router.push(activeName.value)
            //     因为使用activeName跳转不管用了。所以手动添加一个跳转
        }else if(c=="clearOther"){
            tabList.value=tabList.value.filter(tab=>tab.path=="/"||tab.path==activeName.value);
        }
        cookie.set("tabList",tabList.value);
    }
    const initTabList=()=>{
        let tbs=cookie.get("tabList");
        if(tbs){
            tabList.value=tbs;
        }
    };
    initTabList();
    return {
        activeName,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}

