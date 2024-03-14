<template>
  <el-container>
      <el-header>
          <f-header></f-header>
      </el-header>
      <el-container>
          <el-aside>
              <f-menu></f-menu>
          </el-aside>
          <el-man>
              <f-tage-list></f-tage-list>
              <router-view></router-view>
          </el-man>
      </el-container>
  </el-container>
</template>

<script setup>
import FHeader from "~/layout/components/FHeader.vue";
import FMenu from "~/layout/components/FMenu.vue";
import FTageList from "~/layout/components/FTageList.vue";
</script>

<style scoped>

</style>