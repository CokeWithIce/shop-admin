<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">
        <el-tabs
                v-model="activeTab"
                type="card"
                class="demo-tabs flex-1"
                style="min-width:100px"
                @tab-change="changeTab"
                @tab-remove="removeTab"
        >
            <template #add-icon>
                <el-icon><Select/></el-icon>
            </template>
            <el-tab-pane
                    v-for="item in tabList"
                    :key="item.path"
                    :label="item.title"
                    :name="item.path"
                    :closable="item.title!='后台首页'"
            >
            </el-tab-pane>
        </el-tabs>
        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                  <el-icon>
                    <arrow-down/>
                  </el-icon>
                </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                  <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
        </span>
    </div>
  <div style="height:44px;"></div>
</template>
<script setup>
import {ref} from 'vue'
import {Select} from '@element-plus/icons-vue'
import {useRouter,useRoute,onBeforeRouteUpdate} from"vue-router";
import { useCookies } from '@vueuse/integrations/useCookies'
const cookie=useCookies();
const route =useRoute();
const router = useRouter();
const activeTab = ref(route.fullPath);
const tabList = ref([
    {
        title: '后台首页',
        path:'/'
    },{
        title:'商城管理',
        path:'/goods/list'
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
    activeTab.value=to.path;
    addTab({
        title:to.meta.title,
        path:to.path,
    })
})
const changeTab=(t)=>{
    alert(233);
    // activeTab.value=t;
    router.push(t);
}
const removeTab=(t)=>{
    let tabs=tabList.value;
    let a=activeTab.value;
    if(a==t){
        tabs.forEach((tab,index)=>{
            if(tab.path==t){
                const nextTab=tabs[index+1]?tabs[index+1]:tabs[index-1];
                if(nextTab){
                    a=nextTab.path;
                }
            }
        })
    }
    activeTab.value=a;
    tabList.value=tabList.value.filter(tab=>tab.path!=t);
    cookie.set("tabList",tabList.value);
}
const handleClose = (c)=>{
    if(c=="clearAll"){
        activeTab.value='/';
        tabList.value=[{
            title: '后台首页',
            path:'/'
        }]
    }else if(c=="clearOther"){
        tabList.value=tabList.value.filter(tab=>tab.path=="/"||tab.path==activeTab.value);
    }
    cookie.set("tabList",tabList.value);
}
(function initTabList(){
    let tbs=cookie.get("tabList");
    if(tbs){
        tabList.value=tbs;
    }
})();


</script>
<style scoped>
.f-tag-list {
    @apply fixed bg-gray-100 flex items-center px-2;
    top: 64px;
    right: 0px;
    height: 44px;
    z-index: 100;

}
.tag-btn{
    @apply bg-white rounded ml-auto flex items-center justify-center px-2;
    height:32px;
}
:deep(.el-tabs__header){
    @apply mb-0;
    height:32px;
    border: 0 !important;
}
:deep(.el-tabs__nav){
    border:0!important;

}
:deep(.el-tabs__item){
    border:0!important;
    @apply bg-white mx-1 rounded;
    height:32px;
    line-height: 32px;
}
:deep(.is-disabled){
    cursor:not-allowed;
    @apply: text-gray-200;
}
</style>
