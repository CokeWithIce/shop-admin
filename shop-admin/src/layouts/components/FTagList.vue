<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">
        <el-tabs v-model="activeName" type="card" class="demo-tabs flex-1" style="min-width:100px" @tab-remove="removeTab" @tab-change="changeTab">
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
import{useTabList} from "~/composables/useTabList.js";
const {
    activeName,
    tabList,
    router,
    changeTab,
    removeTab,
    handleClose
}=useTabList();
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
