<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData" />
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
        <el-pagination background layout="prev,pager, next" :total="total" v-model="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
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
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import {useInitForm, useInitTable} from "~/composables/useCommon.js";
const {
    tableData,
    currentPage,
    total,
    limit,
    getData,
    loading,
    resetSearchForm,
    handleDelete
} = useInitTable({
    "getList":getNoticeList,
    delete:deleteNotice
});
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit,
}=useInitForm(
    {
        getData,
        update : updateNotice,
        create: createNotice,
        form:reactive({
            title:"",
            content:""
        }),
        rules:{
            title:[
                {required: true, message: '公告标题不能为空', trigger: 'blur'},
            ],
            content:[
                {required: true, message: '公告内容不能为空', trigger: 'blur'},
            ]
        }

    }
);
</script>
<style scoped>

</style>