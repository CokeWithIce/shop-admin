<template>
  <el-container>
      <el-header>
          <f-header></f-header>
      </el-header>
      <el-container>
          <el-aside :width="$store.state.asideWidth">
              <f-menu></f-menu>
          </el-aside>
          <el-main>
              <f-tag-list></f-tag-list>
              <router-view v-slot="{Component}">
                  <transition name="fade">
                      <keep-alive :max="5">
                          <component :is="Component"></component>
                      </keep-alive>
                  </transition>
              </router-view>
          </el-main>
      </el-container>
  </el-container>
</template>

<script setup>
import FHeader from "~/layouts/components/FHeader.vue";
import FMenu from "~/layouts/components/FMenu.vue";
import FTagList from "~/layouts/components/FTagList.vue";
import {useStore} from "vuex";
const store=useStore()
// 适应平板模式
if(store.state.asideWidth=="250px"&&window.innerWidth<1200){
    store.commit('handleAsideWidth');
}
</script>

<style scoped>
.el-aside{
    transition:all 0.2s;
}
.fade-enter-from{
    opacity:0;
}
.fade-enter-to{
    opacity:1;
}
.fade-leave-from{
    opacity:1;
}
.fade-leave-to{
    opacity:0;
}
.fade-enter-active,
.fade-leave-active{
    transition:all 0.3s
}
.fade-enter-active{
    transition-display: 0.3s;
}
</style>