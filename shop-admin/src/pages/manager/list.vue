<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <div class="flex items-center justify-between mb-4">
            <el-button @click="handleCreate" type="primary" size="small">新增</el-button>
            <el-tooltip
                    effect="dark"
                    content="刷新数据"
                    placement="top"
            >
                <el-button @click="getData" class="border-0">
                    <el-icon :size="20">
                        <Refresh/>
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="title" label="标题" width="180"/>
            <el-table-column prop="content" label="内容" width="180"/>
            <el-table-column prop="create_time" label="创建时间"/>
            <el-table-column #default="scope" label="操作">
                <el-button @click="handleEdit(scope.row)" type="primary" size="default" text >修改</el-button>
                <el-popconfirm @confirm="handleDelete(scope.row.id)" title="是否要删除该公告" confirm-button-text="确认"
                               cancel-button-text="取消">
                    <template #reference>
                        <el-button type="primary" size="default" text @click="">删除</el-button>
                    </template>
                </el-popconfirm>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
        <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px;">
                <el-form-item label="公告标题" prop="title">
                    <el-input placeholder="公告标题" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input type="textarea" :rows="7" placeholder="公告内容"  v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>
<script setup>
import {ref,reactive,computed} from "vue";
import {getNoticeList,createNotice,updateNotice,deleteNotice} from "~/api/notice.js";
import {toast} from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";

const tableData = ref([])
// 分页字段
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const loading = ref(false);

//表单抽屉组件的字段
const formDrawerRef=ref(null);
const formRef=ref(null);
const form=reactive({
    title:"",
    content:""
})
const rules= {
    title:[
        {required: true, message: '公告标题不能为空', trigger: 'blur'},
    ],
    content:[
        {required: true, message: '公告内容不能为空', trigger: 'blur'},
    ]
}

//标识
const editId=ref(0);
const drawerTitle=computed(()=>{
    return editId.value==0?"新增":"修改"
})
function getData() {
    loading.value = true;
    getNoticeList(currentPage.value).then((res) => {
        console.log(res);
        tableData.value = res.list;
        total.value = res.totalCount;
    }).catch((e) => {
        toast("获取列表失败")
    }).finally(() => {
        loading.value = false;
    })
}

function handleSubmit(){
    formRef.value.validate((valid)=>{
        if(!valid)return
        formDrawerRef.value.showLoading();
        let fun;
        if(editId.value==0){
            fun=createNotice(form);
        }else{
            fun=updateNotice(editId.value,form)
        }
        fun.then((res)=>{
            toast(drawerTitle.value+"成功");
            getData(editId?false:1);
            formDrawerRef.value.close();
        }).catch((e) => {
            toast(drawerTitle.value+"列表失败","error")
        }).finally(() => {
            formDrawerRef.value.hideLoading();
        })
    })
}
function handleCreate(){
    editId.value=0;
    resetForm({
        title:"",
        content:""
    });
    formDrawerRef.value.open();
}
function handleDelete(id){
    loading.value=true;
    deleteNotice(id).then((res)=>{
        toast("删除成功");
        getData();
    }).catch((e) => {
        toast("删除失败")
    }).finally(() => {
        loading.value=false;
    })
}
function handleEdit(row){
    alert(2)
    resetForm(row);
    editId.value=row.id;
    formDrawerRef.value.open();
}
function resetForm(row=false){
    if(formRef.value){
        formRef.value.clearValidate();
    }
    if(row){
        for(const key in form){
            form[key]=row[key];
        }
    }
}
getData();
</script>
<style scoped>

</style>