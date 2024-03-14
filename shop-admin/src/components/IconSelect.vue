<template>
  <div class="flex items-center">
      <el-icon :size="20" v-if="modelValue" class="mr-2">
          <component :is="modelValue"/>
      </el-icon>
      <el-select filterable @change="handleChange" :modelValue="modelValue" placeholder="请选择图标">
          <el-option
            v-for="item in icons"
            :key="item"
            :label="item"
            :value="item"
          >
          <div class="flex items-center justify-between">
              <el-icon>
                  <component :is="item"></component>
              </el-icon>
              <span class="text-gray-500">{{ item }}</span>
          </div>
          </el-option>
      </el-select>
  </div>
</template>
<script setup>
import {ref} from"vue";
import * as iconList from '@element-plus/icons-vue'
defineProps({
    modelValue:String,
})
const emit =defineEmits(["update:modelValue"])
const icons=ref([]);
icons.value=Object.keys(iconList);
function handleChange(icon){
    emit("update:modelValue",icon);
}
</script>