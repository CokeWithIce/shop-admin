<template>
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <aside-list :active="activeId==item.id" v-for="(item,index) in list " :key="index">
                {{item.name}}
            </aside-list>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
    </el-aside>
    <FormDrawer title="新增图片" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" label-width="80px" :rules="rules" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000">
                </el-input-number>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import {ref,reactive}from"vue"
import AsideList from "~/layouts/components/image/AsideList.vue";
import {getImageClassList,createImageClass} from "~/api/image_class.js";
import {toast} from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";
const loading=ref(false);
const list=ref([]);
const activeId=ref(0);

// 分页字段
const currentPage=ref(1);
const total=ref(0);
const limit=ref(10);
// 表单字段
const formRef=ref(null);
const form=reactive({
    name:"",
    order:50
})
const rules={
    name: [
        {required: true, message: '图库分类名称不能为空', trigger: 'blur'},
    ],
}

function getData(p=null){
    console.log(p)
    if(typeof p=="number"){
        currentPage.value=p;
    }
    loading.value=true;
    getImageClassList(currentPage.value).then(res=>{
        total.value=res.totalCount;
        list.value=res.list;
        let item=list.value[0];
        if(item)
            activeId.value=item.id;
    }).finally(()=>{
        loading.value=false;
    })
}
getData();
const  formDrawerRef=ref(null);
const handleCreate=()=>{
    formDrawerRef.value.open();
}
const handleSubmit=()=>{
    formRef.value.validate((valid)=>{
        if(!valid) return;
        formDrawerRef.value.showLoading();
        createImageClass(form).then((res)=>{
            toast("新增成功");
            getData(1);
            formDrawerRef.value.close();
        }).finally(()=>{
            formDrawerRef.value.hideLoading();
        })
    })
}
defineExpose({
    handleCreate
})
</script>
<style scoped>
.image-aside{
    border-right:1px solid #eee;
    position:relative;
}

.image-aside .top{
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:50px;
    overflow-y:scroll;
}
.image-aside .bottom{
    bottom:0;
    position: absolute;
    right:0;
    left:0;
    height:50px;
    @apply flex items-center justify-center;
}
</style>