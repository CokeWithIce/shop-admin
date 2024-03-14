<template>
    <el-card shado="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        <el-tree
                :data="tableData"
                :props="{label:'name',children:'child'}"
                :loading="loading"
                node-key="id"
                :default-expanded-keys="defaultExpandedKeys"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <el-tag size="small" :type="data.menu?'':'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"/>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-switch @change="handleStatusChange($event,data)" :model-value="data.status" :active-value="1" :inactive-value="0"></el-switch>
                        <el-button @click.stop="handleEdit(data)" text type="primary" size="small">修改</el-button>
                        <el-button @click.stop="addChild(data.id)" text type="primary" size="small">增加</el-button>
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
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader
                        v-model="form.rule_id"
                        :options="options"
                        :props="{value:'id',label:'name',children:'child',checkStrictly:true,emitPath:false}"
                        placeholder="请选择上级菜单"
                    />
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>权限</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input placeholder="名称" style="width:30%" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu==1" label="菜单图标" prop="icon">

                    <IconSelect v-model="form.icon"></IconSelect>
                </el-form-item>
                <el-form-item v-if="form.menu==1&&form.rule_id>0" label="前端路由" prop="frontpath">
                    <el-input placeholder="前端路由" v-model="form.frontpath"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu==0" label="后端规则" prop="condition">
                    <el-input placeholder="后端规则" v-model="form.condition"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu==0" label="请求方式" prop="method">
                    <el-select placeholder="请选择请求方式" v-model="form.method" >
                        <el-option
                            v-for="item in ['GET','POST','PUT','DELETE']"
                            :key="item"
                            :label="item"
                            :value="item"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>
<!--                <el-form-item label="状态" prop="status">
                    <el-input placeholder="状态" v-model="form.status"></el-input>
                </el-form-item>-->
            </el-form>
        </FormDrawer>
    </el-card>
</template>
<script setup>
import {ref,reactive } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import IconSelect from "~/components/IconSelect.vue";
import {getRuleList, createRule,deleteRule, updateRule, updateRuleStatus} from "~/api/rule.js";
import {
    useInitForm,
    useInitTable
} from "~/composables/useCommon.js"
import FormDrawer from "~/components/FormDrawer.vue";
import {createNotice, updateNotice} from "~/api/notice.js";

const defaultExpandedKeys = ref([]);
const options=ref([])
// 列表部分
const {
    tableData,
    getData,
    loading,
    handleDelete,
    handleStatusChange,
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: function (res) {
        options.value=res.rules;
        tableData.value = res.list;
        defaultExpandedKeys.value = res.list.map(o => o.id);
    },
    delete: deleteRule,
    updateStatus: updateRuleStatus
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
        update : updateRule,
        create: createRule,
        form:reactive({
            rule_id:0,
            menu:0,
            name:"",
            condition:"",
            method:"GET",
            status:1,
            order:50,
            icon:"",
            frontpath:""
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
function addChild(id){
    handleCreate();
    form.rule_id=id;
    form.status=1;
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