<template>
  <div class="f-header">
      <span class="logo"><el-icon class="mr-1"><eleme-filled/></el-icon>编程</span>
      <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
          <fold v-if="$store.state.asideWidth=='250px'"/>
          <Expand v-else/>
      </el-icon>
      <el-tooltip effect="dark" content="刷新" placement="bottom">
          <el-icon class="icon-btn" @click="handleRefresh"><refresh/></el-icon>
      </el-tooltip>

      <div class="ml-auto flex items-center" style="margin-left:auto">
          <el-tooltip effect="dark" content="全屏" placement="bottom" >
              <el-icon @click="toggle" class="icon-btn"><full-screen v-if="!isFullscreen" /><aim v-else /></el-icon>
          </el-tooltip>
          <el-dropdown class="dropdown" @command="handleCommand">
              <span class="flex items-center text-light-50">
              <!--                  头像组件-->
                  <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar"/>
                  {{$store.state.user.username}}
                  <el-icon class="el-icon--right"><arrow-down></arrow-down></el-icon>
              </span>
              <template #dropdown>
                  <el-dropdown-menu >
                      <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                      <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
              </template>
          </el-dropdown>
      </div>
  </div>
<!--抽屉组件代码-->
<!--    <el-drawer
        v-model="showDrawer"
        title="修改密码"
        size="45%"
        :direction="direction"
        :before-close="DreawHandleClose"
        :close-on-click-modal="false"
    >
        <el-form ref="formRef" :rules="rules" :model="form"  label-width="auto">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码">

                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" show-password v-model="form.password" placeholder="请输入新密码">

                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" show-password v-model="form.repassword" placeholder="请输入确认密码">

                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" :loading="loading" @click="onsubmit">提交
                </el-button>
            </el-form-item>
        </el-form>
    </el-drawer>-->
    <form-drawer ref="formDrawerRef"  title="修改密码" destroyOnlyClose @submit="onsubmit" >
        <el-form ref="formRef" :rules="rules" :model="form"  label-width="auto">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码">

                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" show-password v-model="form.password" placeholder="请输入新密码">

                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" show-password v-model="form.repassword" placeholder="请输入确认密码">

                </el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>

<script setup>
import {showModal,toast} from "~/composables/util.js";
import {logout,updatepassword} from "~/api/manager.js";
import {useRouter} from "vue-router";
import {useStore} from"vuex";
import {useFullscreen} from "@vueuse/core";
import {ref,reactive} from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {useRepassword,useLogout} from "~/composables/useManager.js";


const showDrawer=ref(false);
const {isFullscreen,toggle}=useFullscreen();
const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onsubmit,
    openRePasswordForm
}=useRepassword()
const {handleLogout}=useLogout();
const router=useRouter();
const store=useStore();



function handleCommand(c){
    switch (c){
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            openRePasswordForm()
            break;
    }
}
const handleRefresh=()=>{
    location.reload();
}




</script>

<style scoped>
.f-header{
    @apply flex bg-indigo-700 text-light-50 fixed top-0 left-0 right-0 items-cneter;
    height:64px;
    z-index: 1000;
}
.logo{
    width:250px;
    @apply flex justify-center items-center text-xl font-thin;
}
.icon-btn{
    @apply flex justify-center;
    width:42px;
    height:64px;
    cursor:pointer;
}
.icon-btn:hover{
    @apply bg-indigo-600;
}
.f-header .dropdown{
    @apply flex justify-center items-center mx-5;
    height:64px;
    cursor:pointer;
}
</style>