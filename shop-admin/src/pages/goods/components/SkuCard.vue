<template>
    <el-form-item label="规格选项" v-loading="bodyLoading">
        <el-card :loading="item.loading" v-for="(item,index) in sku_card_list"
                 :key="item.id"
                 shadow="never"
                 class="w-full mb-3">
            <template #header>
                <div class="flex items-center">
                    <el-input v-model="item.text" placeholder="规格名称"
                              size="small" clearable
                              @change="handleUpdate(item,$emit)">
                        <template #append>
                            <el-icon class="cursor-pointer"
                                     @click="handleChooseSku(item)">
                                <more/>
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button @click="sortCard('up',index)" class="ml-auto"
                               :disabled="index==0"
                               size="small">
                        <el-icon>
                            <Top/>
                        </el-icon>
                    </el-button>
                    <el-button @click="sortCard('down',index)"
                               :disabled="index==(sku_card_list.length-1)"
                            size="small">
                        <el-icon>
                            <Bottom/>
                        </el-icon>
                    </el-button>
                    <el-popconfirm title="是否删除该选项" confirm-button-text="确认"
                                   cancel-button-text="取消"
                                   @confirm="handleDelete(item,$emit)">
                        <template #reference>
                            <el-button size="small">
                                <el-icon>
                                    <Delete/>
                                </el-icon>
                            </el-button>

                        </template>
                    </el-popconfirm>


                </div>
            </template>
            <SkuCardItem :skuCardId="item.id">

            </SkuCardItem>
        </el-card>
        <el-button @click="addSkuCardEvent" :loading="btnLoading" type="success"
                   size="small">
            添加规格
        </el-button>
    </el-form-item>
    <ChooseSku ref="ChooseSkuRef"></ChooseSku>
</template>
<script setup>
import {ref} from"vue";
import SkuCardItem from "~/pages/goods/components/SkuCardItem.vue";
import ChooseSku from "~/components/ChooseSku.vue";
import {
    sku_card_list,
    addSkuCardEvent,
    handleUpdate,
    btnLoading,
    handleDelete,
    sortCard,
    bodyLoading,
    handleChooseSetGoodsSkusCard
} from
        "~/composables/useSku.js";
const ChooseSkuRef=ref(null);
const USEmit = defineEmits([
    'reloadData'
])
function handleChooseSku(item){
    ChooseSkuRef.value.open((value)=>{
        handleChooseSetGoodsSkusCard(item.id,{
            name:value.name,
            value:value.list
        })
    });
}
console.log(sku_card_list.value)
</script>
<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>