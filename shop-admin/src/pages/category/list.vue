<template>
    <el-card shado="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        <el-tree
                :data="tableData"
                :props="{label:'name',children:'child'}"
                :loading="loading"
                node-key="id"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-button text
                                   @click="openGoodsDrawer(data)"
                                   :loading="data.goodsDrawerLoading"
                                   type="primary" size="small">推荐商品</el-button>
                        <el-switch v-loading="data.statusLoading"
                                   @change="handleStatusChange($event,data)" :model-value="data.status" :active-value="1" :inactive-value="0"></el-switch>
                        <el-button @click.stop="handleEdit(data)" text type="primary" size="small">修改</el-button>
                        <span @click.stop="()=>{}">
                              <el-popconfirm @confirm="handleDelete(data.id)" title="是否要删除该记录"
                                             confirm-button-text="确认" cancel-button-text="取消">
                                  <template #reference>
                                      <el-button text type="primary" size="small">删除</el-button>
                                  </template>
                              </el-popconfirm>
                              </span>
                    </div>
                </div>
            </template>
        </el-tree>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input placeholder="分类名称" v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
    </el-card>
</template>
<script setup>
import {ref,reactive } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import GoodsDrawer from "~/pages/category/components/GoodsDrawer.vue";
import {
    getCategoryList,
    createCategory,
    deleteCategory,
    updateCategory,
    updateCategoryStatus,
    getCategoryGoods,
}
    from "~/api/category.js";
import {
    useInitForm,
    useInitTable
} from "~/composables/useCommon.js"
import FormDrawer from "~/components/FormDrawer.vue";
const goodsDrawerRef=ref(null);
// 列表部分
const {
    tableData,
    getData,
    loading,
    handleDelete,
    handleStatusChange,
} = useInitTable({
    getList: getCategoryList,
    onGetListSuccess: function (res) {
        tableData.value = res.map(o=>{
            o.goodsDrawerLoading=false;
            o.statusLoading=false;
            return o;
        });
    },
    delete: deleteCategory,
    updateStatus: updateCategoryStatus
})

// 表单部分
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
        update : updateCategory,
        create: createCategory,
        form:reactive({
            name:"",
        }),
        rules:{
            /*title:[
                {required: true, message: '公告标题不能为空', trigger: 'blur'},
            ],
            content:[
                {required: true, message: '公告内容不能为空', trigger: 'blur'},
            ]*/
        }

    }
);
function openGoodsDrawer(data){
    goodsDrawerRef.value.open(data);
}
</script>
<style>
.custom-tree-node {
    @apply items-center justify-center;
    flex: 1;
    display: flex;
    align-center: center;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node__content {
    padding: 20px 0px;
}

</style>