<template>
<div class="f-menu" :style="{width:$store.state.asideWidth}">
    <el-menu
        :default-active="defaultActive"
        unique-opened
        :collapse="isCollapse"
        default-active="2"
        class="el-menu-vertical-demo border-0"
        @select="handleSelect"
        :collapse-transition="false"
    >
        <template v-for="(item,index) in asideMenus" :key="index">
            <el-sub-menu v-if="item.child&&item.child.length>0" :index="item.name">
                <template #title>
                    <el-icon><component :is="item.icon" ></component></el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <el-menu-item v-for="(item2,index2) in item.child" :key="index2"  :index="item2.frontpath">
                    <el-icon><component :is="item2.icon"></component></el-icon>
                    <span>{{item2.name}}</span>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="item.frontpath">
                <el-icon>
                    <icon-menu/>
                </el-icon>
                <span>{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</div>
</template>

<script setup>

import {useRouter,useRoute,onBeforeRouteUpdate} from"vue-router"
import {computed,ref} from "vue";
import {useStore} from "vuex";


const store=useStore();
const router=useRouter();
const route=useRoute();

const isCollapse = computed(()=>!(store.state.asideWidth=='250px'));
const defaultActive=ref(route.path);

const asideMenus=computed(()=>{
    return store.state.menus;
})
/*
静态变量
* [{
    "name":"后台面板",
    "icon":"help",
    "child":[{
        "name":"主控台",
        "icon":"home-filled",
        "frontpath":"/"
    }]
},{
    "name":"商城管理",
    "icon":"shopping-bag",
    "child":[{
        "name":"商品管理",
        "icon":"shopping-cart-full",
        "frontpath":"/goods/list",
    }]
}];
* */

function handleSelect(e){
    console.log(e)
    router.push(e)
}
onBeforeRouteUpdate((to,from)=>{
    defaultActive.value=to.path;
});
</script>

<style scoped>
.f-menu{
    transition:all 0.2s;
    top:64px;
    left:0px;
    bottom:0px;
    overflow: auto;
    @apply shadow-md fixed bg-light-50;
    overflow-x: hidden;
    overflow-y: auto;
}
.f-menu::-webkit-scrollbar{
    width:0px;
}
</style>