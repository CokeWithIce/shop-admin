<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" :xs="24" class="left">
            <div class="text-left">
                <div class="font-bold text-5xl text-light-50 mb-4">欢迎光临</div>
                <div class="text-gray-200">
                    此站点是《vue3+ vite实战商城后台开发》视频课程的演示地址
                </div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" :xs="24"  class="right">
            <h2 class="font-bold text-3xl text-gray-800 ">
                欢迎回来
            </h2>
            <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
                <span class="h-[1px] w-16 bg-gray-200"></span>
                <span>账号密码登录</span>
                <span class="h-[1px] w-16 bg-gray-200"></span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="form"  class="w-[250px]" label-width="auto">
                <el-form-item prop="username" label="用户名">
                    <el-input  v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon class="el-input__icon"><user /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" show-password v-model="form.password" placeholder="请输入密码" >
                        <template #prefix>
                            <el-icon class="el-input__icon"><lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item >
                    <el-button round color="#626aef" class="w-[250px]" type="primary" :loading="loading" @click="onsubmit">登 录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import {ref,reactive,onMounted,onBeforeUnmount} from "vue";
import {login,getInfo} from"~/api/manager";
import {toast} from "~/composables/util.js";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const form=reactive({
    username:"",
    password:""
})
const rules= {
    username: [
        { required: true, message: '用户名必填', trigger: 'blur' },
    ],
    password:[
        { required: true, message: '密码必填', trigger: 'blur' },
        { min: 5, max: 18, message: '密码长度5到18位', trigger: 'blur' },
    ]
}
const formRef=ref(null);
const loading=ref(false);
const router=useRouter();
const store=useStore();

function onsubmit(){
    formRef.value.validate((valid)=>{
        if(!valid){
            return false;
        }else{
            loading.value=true;
            store.dispatch("login",form).then(res=>{
                toast("登录成功","success");
                router.push("/")
            }).finally(()=>{
                loading.value=false;
            })

        }
    })
}

onMounted(()=>{
    document.addEventListener("keyup",onKeyUp)
})
onBeforeUnmount(()=>{
    document.removeEventListener("keyup",onKeyUp)
})
function onKeyUp(e){
    if(e.key=="Enter")onsubmit();
}
</script>

<style scoped>
.login-container{
    @apply min-h-screen min-w-screen bg-indigo-500;
}
.login-container .left{
    @apply flex items-center justify-center flex-col;
}
.login-container .right{
    @apply bg-light-50 flex items-center justify-center flex-col;
}
</style>