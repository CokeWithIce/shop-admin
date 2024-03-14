<template>
    <div class="flex gap-2" v-loading="loading">
        <el-tag
                effect="plain"
                v-for="(tag,index) in item.goodsSkusCardValue"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
        >
            <el-input style="border:1px solid #A0CFFF; border-radius:
            var(--el-tag-border-radius); border-right:none; outline-color:#A0CFFF"
                      size="small"
                      class="w-20 ml-[-10px] rounded"
                      v-model="tag.text"
                      placeholder="选项值"
                      @change="handleChange($event,tag)">

            </el-input>

        </el-tag>
        <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small"
                   @click="showInput">
            + 添加选项值
        </el-button>
    </div>
</template>
<script setup>
import {ElInput} from 'element-plus'
import {
    initSkusCardItem
} from "~/composables/useSku.js";
const props = defineProps({
    skuCardId: [Number, String],
})
const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange,

} = initSkusCardItem(props.skuCardId);








</script>