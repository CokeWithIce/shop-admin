<template>
  <FormDrawer confirm-text="关联" ref="formDrawerRef"  title="推荐商品"
              @submit="handleConnect">
    <el-table :data="tableData" boder>
        <el-table-column prop="goods_id" label="ID" width="60">

        </el-table-column>
        <el-table-column label="商品封面" width="60">
          <template #default="{row}">
              <el-image :src="row.cover" fit="fill" :lazy="true"
                        style="width:64px; height:84px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="180">

        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{row}">
              <el-popconfirm @confirm="handleDelete(row)"
                             confirm-button-text="确定"
                             cancel-button-text="取消" title="确定要取消关联吗"
              >
                  <template #reference>
                      <el-button :loading="row.loading" type="primary" text
                                 size="default"
                      >删除</el-button>
                  </template>
              </el-popconfirm>
          </template>
        </el-table-column>
    </el-table>
      <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
      <ChooseGoods ref="chooseGoodsRef"></ChooseGoods>
  </FormDrawer>


</template>
<script setup>
import {ref} from"vue";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseGoods from "~/components/ChooseGoods.vue";

import {
    getCategoryGoods,
    deleteCategoryGoods,
    connectCategoryGoods
} from "~/api/category.js";
import {toast} from "~/composables/util.js";

const formDrawerRef=ref(null);
const category_id=ref(0);
const tableData=ref([]);
const goodsDrawerRef=ref(null);
const chooseGoodsRef=ref(null);
function open(item){
    item.goodsDrawerLoading=true;
    category_id.value=item.id;
    getData().then(res=>{
        formDrawerRef.value.open();
    }).finally(()=>{
        item.goodsDrawerLoading=false;
    })

}
function getData(){
    return getCategoryGoods(category_id.value).then((res)=>{
        console.log(res);
      tableData.value=res.map((v)=>{
          v.loading=false;
          return v;
      });
      console.log(tableData.value);
    })
}
function handleDelete(item){
    item.loading=true;
    deleteCategoryGoods(item.id).then((res)=>{
        toast("删除成功")
        getData();
    })
}
function handleConnect(){
    chooseGoodsRef.value.open((goods_ids)=>{
        formDrawerRef.value.showLoading();
        connectCategoryGoods({
            category_id:category_id.value,
            goods_ids,
        }).then((res)=>{
            toast("关联成功")
            getData();
        }).finally(()=>{
            formDrawerRef.value.hideLoading();
        })
    });
}
defineExpose({open})

</script>