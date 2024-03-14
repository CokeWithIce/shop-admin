<template>
  <el-form-item label="规格设置">
      <table class="border">
          <thead>
          <tr>
              <th class="border" :width="th.width" :rowspan="th.rowspan"
                  :colspan="th.colspan" v-for="(th,thi) in tableThs"
                  :key="thi">
                  {{th.name}}
              </th>
          </tr>
          <tr>
              <th class="border pr-2 pl-2" v-for="(th,thi) in skuLabels"
                  :key="thi">
                  {{th.name}}
              </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in sku_list" :key="index" >
              <td class="border text-center" v-for="(sku,skui) in item.skus"
                  :key="skui" >{{sku.value}}</td>
              <td class="boder">
                  <el-input v-model="item.pprice" size="small"
                            type="number"></el-input>
              </td>
              <td>
                  <el-input v-model="item.oprice" size="small"
                            type="number"></el-input>
              </td>
              <td>
              <el-input v-model="item.cprice" size="small"
                        type="number"></el-input>
              </td>
              <td>
                  <el-input v-model="item.stock" size="small"
                            type="number"></el-input>
              </td>
              <td>
                  <el-input v-model="item.volume" size="small"
                            type="number"></el-input>
              </td>
              <td>
                  <el-input v-model="item.weight" size="small"
                            type="number"></el-input>
              </td>
              <td>
                  <el-input v-model="item.code" size="small"
                            type="number"></el-input>
              </td>
          </tr>
          </tbody>

      </table>
  </el-form-item>
</template>
<script setup>
import {ref} from"vue";
import{initSkuTable} from "~/composables/useSku.js";
const{
    skuLabels,
    tableThs,
    sku_list,
}=initSkuTable();
console.log(sku_list.value);



</script>