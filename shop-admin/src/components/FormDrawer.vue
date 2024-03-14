<template>
    <el-drawer
            v-model="showDrawer"
            :title=title
            :size=size
            direction="rtl"
            :close-on-click-modal="false"
            :destroy-on-close=destroyOnlyClose
    >

        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>

            <div class="actions">
                <el-button type="primary" :loading="loading" @click="onsubmit">{{ confirmText }}
                </el-button>
                <el-button type="default" @click="close">取消
                </el-button>
            </div>
        </div>
<!--        <el-form ref="formRef" :rules="rules" :model="form"  label-width="auto">
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
        </el-form>-->
    </el-drawer>
</template>

<script setup>

import {ref} from "vue";
import {showModal} from "~/composables/util.js";
const showDrawer=ref(false);
const loading=ref(false);
const open =()=>showDrawer.value=true;
const close=()=>showDrawer.value=false;
const prop=defineProps({
    title: {
        type:String,
        default:"提示"
    },
    size:{
        type:String,
        default:"75%"
    },
    destroyOnlyClose:{
        type:Boolean,
        default: false
    },
    confirmText:{
        type:String,
        default:"提交"
    }
})
const emit=defineEmits(["submit"])

const onsubmit=()=>emit("submit");
const showLoading=()=>loading.value=true;
const hideLoading=()=>loading.value=false;



//想父组件暴露一下方法
defineExpose({
    open,close,showLoading,hideLoading
})
</script>

<style>
.formDrawer{
    width:100%;
    height:100%;
    position:relative;
    @apply  flex flex-col;
}
.formDrawer .body{
    flex:1;
    overflow-y:auto;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:50px;
}
.formDrawer .actions{
    height:50px;
    @apply mt-auto felx items-center
}
</style>