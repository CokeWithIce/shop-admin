<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="会员等级" />
            <el-table-column prop="discount" label="折扣率"
                             style="text-align: center" />
            <el-table-column prop="level" label="等级序号"
                             style="text-align: center" />

            <el-table-column prop="status" width="120" label="状态">
                <template #default="{row}">
                    <el-switch  :loadig="row.statusLoading" @change="handleStatusChange($event,row)" :model-value="row.status" :active-value="1" :inactive-value="0">

                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column #default="scope" label="操作">
                <el-button @click="handleEdit(scope.row)" type="primary" size="default" text >修改</el-button>
                <el-popconfirm @confirm="handleDelete(scope.row.id)"
                               title="是否要删除该记录" confirm-button-text="确认"
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
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="等级名称" prop="name">
                    <el-input placeholder="等级名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input placeholder="等级权重" v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <small class="text-xs mr-2">累计消费满</small>
                        <el-input type="number" style="width:50%"
                                  placeholder="累计消费"
                                  v-model="form.max_price">
                            <template #append>
                                元
                            </template>
                        </el-input>
                    </div>
                    <div>
                        <small class="text-xs mr-2">累计次数满</small>
                        <el-input type="number" style="width:50%"
                                  placeholder="累计次数"
                                  v-model="form.max_times">
                            <template #append>
                                次
                            </template>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率" prop="level">
                    <el-input placeholder="折扣率"
                              v-model="form.discount" style="width:50%">
                        <template #append>
                            %
                        </template>
                    </el-input>
                    <small class="text-gray-400 flex">
                        折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
                    </small>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>
<script setup>
import {ref,reactive,computed} from "vue";
import {getUserLevelList, createUserLevel, updateUserLevel,
    deleteUserLevel, updateUserLevelStatus} from "~/api/level.js";
import{getRuleList} from "~/api/rule.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
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
    handleStatusChange
} = useInitTable({
    "getList":getUserLevelList,
    delete:deleteUserLevel,
    updateStatus:updateUserLevelStatus
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
        update : updateUserLevel,
        create: createUserLevel,
        form:reactive({
            name:"",
            level:100,
            status:1,
            discount:0,
            max_price:0,
            max_times:0,
        }),
        rules:{
            name:[
                {required: true, message: '会员等级名称不能为空', trigger: 'blur'},
            ],
        },
        onGetListSuccess:(res)=>{
            tableData.value=res.list.map(v=>v.statusLoading=false);
            total.value=res.totalCount;
        },

    }
);

</script>
<style scoped>

</style>