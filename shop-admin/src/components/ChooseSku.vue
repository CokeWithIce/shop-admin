<template>
  <el-dialog title="规格服务" v-model="dialogVisible" width="80%" top="5vh">
      <el-container style="height:65vh">
          <el-aside class="w-[220px] image-aside">
              <div class="top">
                  <div class="sku-list" @click="handleChangeActiveId(item.id)"
                       :class="activeId==item.id?'active':''"
                       v-for="(item,index) in tableData"
                       :key="index">
                      {{item.name}}
                  </div>
              </div>
              <div class="bottom">
                  <el-pagination background layout="prev, next" :total="total" v-model="currentPage" :page-size="limit" @current-change="getData"/>

              </div>
          </el-aside>
          <el-main>
              <el-checkbox-group v-model="form.list" size="small" @change="">
                  <el-checkbox class="mb-3" border v-for="(item,index) in list"
                                      :key="index"
                                      :label="item">
                      {{item}}
                  </el-checkbox>
              </el-checkbox-group>
          </el-main>
      </el-container>
      <template #footer>
          <span>
              <el-button @click=" ">删除</el-button>
              <el-button @click="submit">确认</el-button>

          </span>
      </template>
  </el-dialog>
</template>
<script setup>
import {ref,reactive} from"vue";
import AsideList from "~/components/image/AsideList.vue";
import{getSkusList} from "~/api/skus.js";
import {useInitTable} from "~/composables/useCommon.js";
const dialogVisible=ref(false);
const activeId=ref(0);
const list=ref([])
const form=reactive({
    list:[],
    name:'',
})
const{
    loading,
    currentPage,
    limit,
    total,
    tableData,
    getData,
}=useInitTable({
    getList: getSkusList,
    onGetListSuccess:function(res){
        tableData.value=res.list;
        total.value=res.totalCount;
        if(tableData.value.length>0){
            handleChangeActiveId(tableData.value[0].id);
        }
    },
})
const callBackFunction=ref(null);
function open(callBack=null){
    callBackFunction.value=callBack;
    getData(1)
    dialogVisible.value=true;
}
function submit(){
    if(typeof callBackFunction.value=="function"){
        callBackFunction.value(form);
    }
    dialogVisible.value=false;
}
function handleChangeActiveId(id){
    activeId.value=id;
    list.value=[];
    let midL=tableData.value.find(o=>o.id==id);
    if(midL){
        list.value=midL.default.split(",");
        form.name=midL.name;
    }

}
defineExpose({
    open,
})
</script>
<style scoped>
.image-aside{
    border-right:1px solid #eee;
    position:relative;
}

.image-aside .top{
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:50px;
    overflow-y:scroll;
}
.image-aside .bottom{
    bottom:0;
    position: absolute;
    right:0;
    left:0;
    height:50px;
    @apply flex items-center justify-center;
}
.sku-list{
    @apply p-3 text-sm text-gray-600 items-center cursor-pointer;
    border-bottom:1px solid #f4f4f4;
}
.sku-list:hover,.active{
    @apply bg-blue-50;
}
</style>