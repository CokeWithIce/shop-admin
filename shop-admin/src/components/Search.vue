<template>
    <el-form class="mb-3 small" :model="model" ref="searchFormRef" label-width="90px">
        <el-row :gutter="20">
            <slot/>
            <template v-if="showSearch">
                <slot name="show"/>
            </template>
            <el-col :span="8" :offset="showSearch?0:8">
                <div class="flex items-center justify-end">
                    <el-button type="primary" @click="$emit('search')">
                        搜索
                    </el-button>
                    <el-button type="danger" @click="$emit('reset')">
                        重置
                    </el-button>
                    <el-button v-if="hasShowSearch" type="primary" @click="showSearch=!showSearch">
                        {{showSearch?"收起":"展开"}}
                        <el-icon>
                            <ArrowUp v-if="showSearch"></ArrowUp>
                            <ArrowDown v-else></ArrowDown>
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>
<script setup>
import {ref,useSlots} from"vue";
defineProps({
    model:Object,
})
const emit=defineEmits(["search","reset"])
const showSearch=ref(false);
const slots=useSlots();
const hasShowSearch=ref(!!slots.show);
</script>