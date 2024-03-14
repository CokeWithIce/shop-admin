<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <ListHeader @delete="handleMultiDelete" :layout="'create,refresh,delete'" @create="handleCreate" @refresh="getData" />
        <el-table @selection-change="handleSelectionChange" ref="multipleTableRef" :data="tableData" stripe style="width: 100%">
            <el-table-column type="selection" width="55" ></el-table-column>
            <el-table-column prop="name" label="角色名称" width="180"/>
            <el-table-column prop="default" label="规格值" width="180"/>
            <el-table-column prop="order" label="排序" width="180"/>

            <el-table-column prop="status" width="120" label="状态">
                <template #default="{row}">
                    <el-switch  :loadig="row.statusLoading" @change="handleStatusChange($event,row)" :model-value="row.status" :active-value="1" :inactive-value="0">

                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column #default="scope" label="操作">
                <el-button @click="handleEdit(scope.row)" type="primary" size="default" text >修改</el-button>
                <el-popconfirm @confirm="handleDelete(scope.row.id)" title="是否要删除该规格" confirm-button-text="确认"
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
<!--        增改列表-->
        <FormDrawer destroy-only-close ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="角色名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="ordre">
                    <el-input-number placeholder="排序" :min="0" :max="99999" v-model="form.order"></el-input-number>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
<!--                    <el-input placeholder="规格值"  v-model="form.default"></el-input>-->
                    <tag-input v-model="form.default">

                    </tag-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>
<script setup>
import {ref,reactive,computed} from "vue";
import {getSkusList,setSkusRules, createSkus, updateSkus, deleteSkus, updateSkusStatus} from "~/api/skus.js";
import{getRuleList} from "~/api/rule.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import TagInput from "~/components/TagInput.vue";
import {toast} from "~/composables/util.js";
import {useInitForm, useInitTable} from "~/composables/useCommon.js";
const {
    tableData,
    currentPage,
    total,
    limit,
    getData,
    loading,
    resetSearchForm,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    handleMultiDelete,
    multipleTableRef
} = useInitTable({
    "getList":getSkusList,
    delete:deleteSkus,
    updateStatus:updateSkusStatus
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
        update : updateSkus,
        create: createSkus,
        form:reactive({
            name:"",
            default:"",
            status:1,
            order:50,
        }),
        rules:{
            name:[
                {required: true, message: '角色名称不能为空', trigger: 'blur'},
            ],
            default:[
                {required: true, message: '规格值不能为空'},
                {pattern: /\S+(,\S+)+/, message: '规格值至少输入2个'},

            ],
        },

    }
);

</script>
<style scoped>

</style>