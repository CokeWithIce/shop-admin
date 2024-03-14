<template>
    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-only-close>
        <el-form v-model="form">
            <el-form-item>
                <Editor v-model="form.content">

                </Editor>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import {ref, reactive} from "vue";
import {readGoods, updateGoods} from "~/api/goods.js";
import {toast} from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";
import Editor from "~/components/Editor.vue";

const loading = ref(false);
const formDrawerRef = ref(null);
const form = reactive({
    content:"",
})
const goodsId = ref(0);
const emit=defineEmits(['reloadData'])

function open(row) {
    row.contentLoading=true;
    goodsId.value = row.id;
    readGoods(goodsId.value).then((res) => {
        form.content=res.content
        formDrawerRef.value.open();
    }).finally(() => {
        row.contentLoading=false;
    })

}

function submit() {
    formDrawerRef.value.showLoading();
    loading.value = true;
    updateGoods(goodsId.value, form).then((res) => {
        toast("设置商品详情图成功");
        formDrawerRef.value.close();
        emit("reloadData");
    }).finally(() => {
        formDrawerRef.value.hideLoading();
    })
}

defineExpose({open})
</script>