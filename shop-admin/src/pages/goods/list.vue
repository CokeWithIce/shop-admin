<template>
    <div>
        <el-tabs v-model="searchForm.tab" class="demo-tabs"
                 @tab-change="getData">
            <el-tab-pane v-for="(item,index) in tabbars" :key="index"
                         :label="item.name" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card v-loading="loading" shadow="never" class="border-0">
            <Search :model="searchForm" @search="getData"
                    @reset="resetSearchForm">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.title" placeholder="商品名称"
                              clearable></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="商品分类">
                        <el-select clearable v-model="searchForm.category_id"
                                   placeholder="请选择商品分类">
                            <el-option v-for="(item,index) in categoryList"
                                       :key="item.id"
                                       :label="item.name"
                                       :value="item.id"
                            >

                            </el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>
            <ListHeader layout="'create,refresh" @create="handleCreate"
                        @refresh="getData">
                <el-button type="danger"
                    v-if="searchForm.tab!='delete'"
                           size="small" @click="handleMultiDelete()">批量删除
                </el-button>
                <el-button type="warning"
                    v-else
                    size="small" @click="handleRestoreGoods()">批量恢复
                </el-button>
                <el-popconfirm v-if="searchForm.tab=='delete'"
                               @confirm="handleDestroyGoods()"
                               title="是否要彻底删除"
                               confirm-button-text="确认"
                               cancel-button-text="取消">
                    <template #reference>
                        <el-button type="danger" size="small">彻底删除
                        </el-button>
                    </template>
                </el-popconfirm>

                <el-button v-if="searchForm.tab=='all'||searchForm.tab=='off'"
                           size="small" @click="handleMultiChangeStatus(1)">上架
                </el-button>
                <el-button
                        v-if="searchForm.tab=='all'||searchForm.tab=='saling'"
                        size="small" @click="handleMultiChangeStatus(0)">下架
                </el-button>
            </ListHeader>
            <el-table ref="multipleTableRef"
                      @selection-change="handleSelectionChange"
                      :data="tableData" stripe style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="商品" width="300">
                    <template #default="{row}">
                        <div class="flex items-center">
                            <el-image
                                    class="mr-3 rounded"
                                    :src="row.cover"
                                    fit="cover"
                                    :lazy="true"
                                    style="width:50px;height:50px;"
                            >
                            </el-image>
                            <div class="flex-2">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">{{ row.min_price }}</span>
                                    <el-divider direction="vertical"/>
                                    <span class="text-gray-500 text-xs">{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">
                                    分类:{{ row.category ? row.category.name : "未分类" }}</p>
                                <p class="text-gray-400 text-xs">
                                    创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sale_count" label="实际销量" width="90">

                </el-table-column>
                <el-table-column prop="create_time" width="100" label="状态">
                    <template #default="{row}">
                        <el-tag :type="row.status?'success':'danger'"
                                size="small">
                            {{ row.status ? '上架' : '仓库' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="searchForm.tab!='delete'"
                                 prop="create_time" width="120" align="center"
                                 label="审核状态">
                    <template #default="{row}">
                        <div class="flex flex-col" v-if="row.ischeck==0">
                            <el-button type="success" size="small" plain>
                                审核通过
                            </el-button>
                            <el-button type="danger" class="mt-2 !ml-0"
                                       size="small" plain>审核拒绝
                            </el-button>
                        </div>
                        <span v-else>
                            {{ row.ischeck == 1 ? '通过' : '拒绝' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="总库存" width="90">

                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab!='delete'">
                            <el-button class="p-1"
                                       @click="handleEdit(scope.row)"
                                       type="primary" size="default" text>修改
                            </el-button>
                            <el-button @click="handleSetSkusContent(scope.row)"
                                       class="p-1"
                                       size="default"
                                       :type="(scope.row.sku_type==0&&!scope.row.sku_value)||(scope.row.sku_type==1&&!scope.row.goods_skus.length)?'danger':'primary'"
                                       text :loading="scope.row.skusLoading">
                                商品规格
                            </el-button>
                            <el-button @click="handleSetGoodsBanners(scope.row)"
                                       class="p-1"
                                       :type="scope.row.goods_banner.length==0?'danger':'primary'"
                                       size="default" text
                                       :loading="scope.row.bannersLoading">设置轮播图
                            </el-button>
                            <el-button @click="handleSetGoodsContent(scope.row)"
                                       :loading="scope.row.contentLoading"
                                       class="p-1" type="primary" size="default"
                                       text
                                       :type="!scope.row.content?'danger':'primary'">
                                商品详情
                            </el-button>

                            <el-popconfirm @confirm="handleDelete(scope.row.id)"
                                           title="是否要删除该商品"
                                           confirm-button-text="确认"
                                           cancel-button-text="取消">
                                <template #reference>
                                    <el-button class="p-1" type="primary"
                                               size="default" text>删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <small v-else
                               class="text-sm text-gray-500">暂无操作</small>

                    </template>
                </el-table-column>
            </el-table>
            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev,pager, next"
                               :total="total" v-model:current-page="currentPage"
                               :page-size="limit"
                               @update:current-page="getData"/>
            </div>
            <FormDrawer ref="formDrawerRef" :title="drawerTitle"
                        @submit="handleSubmit">
                <el-form :model="form" ref="formRef" :rules="rules"
                         label-width="80px">
                    <el-form-item label="商品名称" prop="title">
                        <el-input placeholder="请输入商品名称，不能超过60个字符。"
                                  v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <ChooseImage v-model="form.cover"/>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select placeholder="请选择所属商品分类"
                                   v-model="form.category_id">
                            <el-option
                                    v-for="item in categoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="desc">
                        <el-input type="textarea" rows="7"
                                  placeholder="选填，商品买点"
                                  v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <el-input placeholder="请输入单位" v-model="form.unit"
                                  style="width:50%"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" prop="stock">
                        <el-input type="number" v-model="form.stock"
                                  style="width:40%">
                            <template #append>
                                {{ form.unit }}
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input type="number" v-model="form.min_stock"
                                  style="width:40%">
                            <template #append>
                                {{ form.unit }}
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低销售价格" prop="min_price">
                        <el-input type="number" v-model="form.min_price"
                                  style="width:40%">
                            <template #append>
                                元
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice">
                        <el-input type="number" v-model="form.min_oprice"
                                  style="width:40%">
                            <template #append>
                                元
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :label="0">隐藏</el-radio>
                            <el-radio :label="1">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="0">放入仓库</el-radio>
                            <el-radio :label="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>
        <banners @reloadData="getData" ref="bannersRef"></banners>
        <Content @reloadData="getData" ref="contentRef"></Content>
        <Skus @reloadData="getData" ref="skusRef"></Skus>

    </div>
</template>
<script setup>
import {ref, reactive, computed} from "vue";
import {
    getGoodsList,
    updateGoodsStatus,
    createGoods,
    updateGoods,
    deleteGoods,
    restoreGoods,
    destroyGoods,
} from "~/api/goods.js";
import {toast} from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import {useInitTable, useInitForm} from "~/composables/useCommon.js"
import ListHeader from "~/components/ListHeader.vue";
import {getCategoryList} from "~/api/category.js";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
import Banners from "~/pages/goods/banners.vue";
import Content from "~/pages/goods/content.vue";
import Skus from "~/pages/goods/skus.vue";

const bannersRef = ref(null);
const contentRef = ref(null);
const skusRef = ref(null);

const tab = ref("all");
const showSearch = ref(false);
const tabbars = [
    {key: "all", name: "全部"},
    {key: "checking", name: "审核中"},
    {key: "saling", name: "出售中"},
    {key: "off", name: "已下架"},
    {key: "min_stock", name: "库存预警"},
    {key: "delete", name: "回收站"},
]
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
    handleDelete,
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete,
    multiSelectionIds
} = useInitTable({
    "getList": getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.bannersLoading = false;
            o.contentLoading = false;
            o.skusLoading = false;
            return o;
        })
        total.value = res.totalCount;
    },
    "searchForm": reactive({
        title: "",
        tab: tab.value,
        category_id: null
    }),
    delete: deleteGoods,
    updateStatus: updateGoodsStatus
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
    handleEdit
} = useInitForm(
    {
        getData,
        update: updateGoods,
        create: createGoods,
        form: reactive({
            title: "",
            category_id: null,
            cover: null,
            desc: "",
            unit: "件",
            stock: 100,
            min_stock: 10,
            status: 1,
            stock_display: 1,
            min_price: 0,
            min_oprice: 0
        }),
        rules: {
            /*username:[
                {required: true, message: '用户名不能为空', trigger: 'blur'},
            ],
            password:[
                {required: true, message: '密码不能为空', trigger: 'blur'},
            ]
            ,
            role_id:[
                {required: true, message: '角色必选', trigger: 'blur'},
            ]*/
        }

    }
);
const categoryList = ref([])
getCategoryList().then((res) => {
    categoryList.value = res;
})
function handleMultiChangeStatus(status) {
    loading.value = true;
    updateGoodsStatus(multiSelectionIds.value, status).then((res) => {
        toast("变更");
        getData();
    }).finally(() => {
        loading.value = false;
    })
}

function handleSetGoodsBanners(row) {
    bannersRef.value.open(row);
}

function handleSetGoodsContent(row) {
    contentRef.value.open(row);
}

function handleSetSkusContent(row) {
    skusRef.value.open(row);
}
function handleRestoreGoods(){
    useMultiAction(restoreGoods,"回复")

}
function handleDestroyGoods(){
    useMultiAction(destroyGoods,"彻底删除")
}
function useMultiAction(func,msg){
    loading.value=true;
    func(multiSelectionIds.value).then((res)=>{
        toast(`${msg}成功`);
        if(multipleTableRef.value){
            multipleTableRef.value.clearSelection();
        }
        getData();
    }).finally(()=>{
        loading.value=false;
    })
}
</script>
<style scoped>

</style>