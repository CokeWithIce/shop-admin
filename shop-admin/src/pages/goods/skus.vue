<template>
    <FormDrawer ref="formDrawerRef" :size="'70%'" title="设置商品规格"
                @submit="submit"
                destroy-only-close>
        <el-form v-model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :label="0">
                        <el-tag effect="plain">单规格</el-tag>
                    </el-radio>
                    <el-radio :label="1">
                        <el-tag effect="plain">多规格</el-tag>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.sku_type==0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice"
                              style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice"
                              style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice"
                              style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight"
                              style="width:35%">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积" >
                    <el-input v-model="form.sku_value.volume"
                              style="width:35%">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else>
                <SkuCard @reloadData="handleReloadData"></SkuCard>
                <SkuTable></SkuTable>
            </template>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import {ref, reactive} from "vue";
import {readGoods, updateGoodsSkus} from "~/api/goods.js";
import {toast} from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";
import SkuCard from"~/pages/goods/components/SkuCard.vue";
import {goodsId,initSkuCardList,sku_list} from "~/composables/useSku.js";
import SkuTable from "~/components/SkuTable.vue";

const loading = ref(false);
const formDrawerRef = ref(null);
const form = reactive({
    sku_type:0,
    sku_value:{
        "oprice":0,
        "pprice":0,
        "cprice":0,
        "weight":0,
        "volume":0,
    }
})
const emit=defineEmits(['reloadData'])

function open(row) {
    row.skusLoading=true;
    goodsId.value = row.id;
    readGoods(goodsId.value).then((res) => {
        form.sku_type=res.sku_type;
        if(res.sku_value)
            form.sku_value=res.sku_value;
        initSkuCardList(res)
        formDrawerRef.value.open();
    }).finally(() => {
        row.skusLoading=false;
    })

}

function submit() {
    formDrawerRef.value.showLoading();
    let data={
        sku_type:form.sku_type,
        sku_value:form,
    }
    if(form.sku_type==1){
        data.goodsSkus=sku_list.value;
    }
    updateGoodsSkus(goodsId.value, data).then((res) => {
        toast("设置商品规格成功");
        formDrawerRef.value.close();
        emit("reloadData");
    }).finally(() => {
        formDrawerRef.value.hideLoading();
    })
}
function handleReloadData(){
    emit("reloadData");
}
defineExpose({open})
</script>