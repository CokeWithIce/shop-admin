<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="角色名称" width="180"/>
            <el-table-column prop="desc" label="角色描述" width="180"/>
            <el-table-column prop="status" width="120" label="状态">
                <template #default="{row}">
                    <el-switch  :loadig="row.statusLoading" @change="handleStatusChange($event,row)" :model-value="row.status" :active-value="1" :inactive-value="0">

                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column #default="scope" label="操作">
                <el-button @click="openSetRule(scope.row)" type="primary" size="default" text >配置权限</el-button>

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
<!--        增改列表-->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="角色名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input placeholder="角色描述"  v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
<!--        权限配置表-->
        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 :check-strictl="checkStrictl" @check="handleTreeCheck" ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="ruleList" :props="{label:'name',children:'child'}" show-checkbox :height="treeHeight">
              <template #default="{node,data}">
                  <div class="flex item-center">
                      <el-tag :type="data.memu?'':'info'" size="small">'
                          {{data.menu?"菜单":"权限"}}
                      </el-tag>
                      <span class="ml-2 text-sm">{{data.name}}</span>
                  </div>
              </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>

</template>
<script setup>
import {ref,reactive,computed} from "vue";
import {getRoleList,setRoleRules, createRole, updateRole, deleteRole, updateRoleStatus} from "~/api/role.js";
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
    "getList":getRoleList,
    delete:deleteRole,
    updateStatus:updateRoleStatus
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
        update : updateRole,
        create: createRole,
        form:reactive({
            name:"",
            desc:"",
            status:1
        }),
        rules:{
            name:[
                {required: true, message: '公告标题不能为空', trigger: 'blur'},
            ],
        },
        onGetListSuccess:(res)=>{
            tableData.value=res.list.map(o=>{
                o.statusLoading=false;
                return o;
            })
            total.value=res.totalCount;
            roles.value=res.roles;
        },

    }
);

const setRuleFormDrawerRef=ref(null);
const ruleList=ref([]);
const treeHeight=ref(0);
const roleId=ref(0);
const defaultExpandedKeys=ref([])
const elTreeRef=ref(null);
const ruleIds=ref([]);
const checkStrictl=ref(false);
function openSetRule(row){
    ruleIds.value=[];
    roleId.value=row.id;
    treeHeight.value=window.innerHeight-180;
    checkStrictl.value=true;
    getRuleList(1).then((res)=>{
        ruleList.value=res.list;
        defaultExpandedKeys.value=res.list.map(o=>o.id);
        setRuleFormDrawerRef.value.open();
    //     当前角色用户有的权限
        ruleIds.value=row.rules.map(o=>o.id);
        setTimeout(()=>{
            elTreeRef.value.setCheckedKeys(ruleIds.value);
            checkStrictl.value=false;
        },150)
    }).catch((error)=>{
        console.log(error);
    }).finally(()=>{
    })
}
function handleSetRuleSubmit(){
    setRuleFormDrawerRef.value.showLoading();
    setRoleRules(roleId.value,ruleIds.value).then((res)=>{
        toast("配置成功");
        getData();
        setRuleFormDrawerRef.value.close();
    }).catch((error)=>{
        console.log(error);
    }).finally(()=>{
        setRuleFormDrawerRef.value.hideLoading();
    });
}
function handleTreeCheck(...e){
    const {checkedKeys,halfCheckedKeys}=e[1];
    ruleIds.value=[...checkedKeys,...halfCheckedKeys];
}
</script>
<style scoped>

</style>