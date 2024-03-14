<template>
    <el-drawer
            title="设置轮播图"
            v-model="dialogVisible"
            direction="rtl"
            size="50%"
            destroy-on-close="true"

    >
        <el-form v-model="form" :rules="rules" label-width="80px" :inline="false" size="normal">
            <el-form-item label="轮播图" prop="banners">
                <ChooseImage :limit="9" v-model="form.banners"></ChooseImage>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<script setup>
import {ref, reactive} from "vue";
import ChooseImage from "~/components/ChooseImage.vue";
import {readGoods, setGoodsBanner} from "~/api/goods.js";
import {toast} from "~/composables/util.js";

const loading = ref(false);
const dialogVisible = ref(false);
const form = reactive({
    banners: []
})
const goodsId = ref(0);
const emit=defineEmits(['reloadData'])

function open(row) {
    row.bannersLoading=true;
    goodsId.value = row.id;
    readGoods(goodsId.value).then((res) => {
        form.banners = res.goodsBanner.map(o => o.url);
        dialogVisible.value = true;
    }).finally(() => {
        row.bannersLoading=false;
    })

}

function submit() {
    loading.value = true;
    setGoodsBanner(goodsId.value, form).then((res) => {
        toast("设置轮播图成功");
        dialogVisible.value = false;
        emit("reloadData");
    }).finally(() => {
        loading.value = false;
    })
}

defineExpose({open})
</script>