<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
            <SearchItem label="关键词">
                <el-input placeholder="手机号/邮箱/会员昵称" clearable
                          v-model="searchForm.keyword"></el-input>
            </SearchItem>
            <template #show>
                <SearchItem label="会员等级">
                    <el-select v-model="searchForm.user_level_id"
                               placeholder="请选择会员等级" >
                        <el-option v-for="(item,index) in user_level"
                                   :key="item.id" :label="item.name"
                                   :value="item.id">

                        </el-option>
                    </el-select>

                </SearchItem>
            </template>
        </Search>
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="会员" width="200">
                <template #default="{row}">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar" >
                            <img src/>
                        </el-avatar>
                        <div class="ml-3">
                            <h6>{{row.username}}</h6>
                            <small>ID:{{row.id}}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="会员等级">
                <template #default="{row}">
                    {{row.user_level?.name||"-"}}
                </template>
            </el-table-column>
            <el-table-column label="登录注册">
                <template #default="{row}">
                    <p v-if="row.last_login_time">最后登录时间:{{row.last_login_time}}</p>
                    <p>注册时间:{{row.create_time}}</p>

                </template>
            </el-table-column>
            <el-table-column prop="create_time" width="100" label="状态">
                <template #default="{row}">
                    <el-switch :disabled="row.super==1" :loadig="row.statusLoading" @change="handleStatusChange($event,row)" :model-value="row.status" :active-value="1" :inactive-value="0">

                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super==1" class="text-sm text-gray-500">暂无操作</small>
                    <div v-else>
                        <el-button @click="handleEdit(scope.row)" type="primary" size="default" text >修改</el-button>
                        <el-popconfirm @confirm="handleDelete(scope.row.id)"
                                       title="是否要删除该记录"
                                       confirm-button-text="确认"
                                       cancel-button-text="取消">
                            <template #reference>
                                <el-button type="primary" size="default" text @click="">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev,pager, next" :total="total" v-model:current-page="currentPage" :page-size="limit" @update:current-page="getData"/>
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input placeholder="用户名" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input placeholder="密码"  v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input placeholder="昵称"
                              v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar"></ChooseImage>
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select placeholder="选择会员等级" v-model="form.user_level_id">
                        <el-option
                                v-for="item in user_level"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input placeholder="手机"
                              v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="emall">
                    <el-input placeholder="邮箱"
                              v-model="form.emall"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>
<script setup>
import {ref,reactive,computed} from "vue";
import {getUserList,updateUserStatus,createUser,updateUser,deleteUser} from
        "~/api/user.js";
import {toast} from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import {useInitTable,useInitForm} from "~/composables/useCommon.js"
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
const roles=ref([])
const user_level=ref([]);
const {
    searchForm,
    tableData,
    currentPage,
    total,
    limit,
    getData,
    loading,
    resetSearchForm,
    handleStatusChange,
    handleDelete

} = useInitTable({
    "getList":getUserList,
    onGetListSuccess:(res)=>{
        tableData.value=res.list.map(o=>{
            o.statusLoading=false;
            return o;
        })
        total.value=res.totalCount;
        user_level.value=res.user_level;
    },
    "searchForm":reactive({
        keyword:"",
        user_level_id:null,
    }),
    delete:deleteUser,
    updateStatus:updateUserStatus
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
        update : updateUser,
        create: createUser,
        form:reactive({
            username:"",
            password:"",
            user_level_id:"",
            status:1,
            avatar:"",
            nickname:"",
            phone:"",
            emall:"",
        }),
        rules:{
            username:[
                {required: true, message: '用户名不能为空', trigger: 'blur'},
            ],
            password:[
                {required: true, message: '密码不能为空', trigger: 'blur'},
            ]
            ,
            user_level_id:[
                {required: true, message: '会员等级必选', trigger: 'blur'},
            ]
        }

    }
);








getData();
</script>
<style scoped>

</style>