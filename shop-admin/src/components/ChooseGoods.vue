<template>
  <el-dialog title="商品选择" v-model="dialogVisible" width="80%" destroy-on-close>
      <el-table ref="multipleTableRef" height="300px"
                @selection-change="handleSelectionChange" :data="tableData"
                stripe style="width:100%"  v-loading="loading">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品" >
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
                          <p class="text-gray-400 text-xs mb-1">
                              分类:{{ row.category ? row.category.name : "未分类" }}</p>
                          <p class="text-gray-400 text-xs">
                              创建时间：{{ row.create_time }}</p>
                      </div>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="stock" label="总库存" width="90">
          </el-table-column>
          <el-table-column  label="价格（元）" width="150">
              <template #default="{row}">
                  <span class="text-rose-500">￥{{row.min_price}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class="text-gray-400 text-xs">￥{{row.min_oprice}}</span>
              </template>
          </el-table-column>
      </el-table>
      <div class="flex items-center justify-center mt-5">
          <el-pagination background layout="prev,pager, next"
                         :total="total" v-model:current-page="currentPage"
                         :page-size="limit"
                         @update:current-page="getData"/>
      </div>
      <template #footer>
          <span>
              <el-button @click="close">取消</el-button>
              <el-button @click="submit">提交</el-button>
          </span>
      </template>
  </el-dialog>
</template>
<script setup>
import {reactive, ref} from "vue";
import { getGoodsList,} from "~/api/goods.js";
import {useInitTable} from "~/composables/useCommon.js";
const callbackFun=ref(null);
const dialogVisible=ref(false);
const {
    searchForm,
    tableData,
    currentPage,
    total,
    limit,
    getData,
    loading,
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete,
    multiSelectionIds
} = useInitTable({
    "getList": getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount;
    },
    "searchForm": reactive({
        title: "",
        category_id: null
    }),
});
function submit(){
    if(typeof callbackFun.value=="function"){
        callbackFun.value(multiSelectionIds.value);
    }
    close();
}
function close(){
    dialogVisible.value=false
}
function open(callback=null){
    callbackFun.value=callback;
    dialogVisible.value=true;
}
defineExpose({open})
</script>