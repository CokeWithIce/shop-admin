<template>
    <div class="flex items-center justify-between mb-4">
        <div>
            <el-button v-if="prop.layout.indexOf('create')!=-1" @click="$emit('create')" type="primary" size="small">新增</el-button>
            <el-popconfirm v-if="prop.layout.indexOf('delete')!=-1"  @confirm="$emit('delete')" title="是否要删除选中记录" confirm-button-text="确认" cancel-button-text="取消">
                <template #reference>
                    <el-button  type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
            <slot/>
        </div>
        <el-tooltip
                v-if="prop.layout.indexOf('refresh')!=-1"
                effect="dark"
                content="刷新数据"
                placement="top"
        >
            <el-button @click="$emit('refresh')" class="border-0">
                <el-icon :size="20">
                    <Refresh/>
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>
<script setup>
const prop=defineProps({
    layout:{
        type:String,
        default:"create,refresh"
    }
})
defineEmits(['create','refresh','delete'])

</script>