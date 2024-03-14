<template>
  <el-card shadow="never">
      <template #header>
          <div class="flex justify-between">
              <span class="text-sm">
                订单统计
              </span>
              <div>
                  <el-check-tag @click="handleChoose(item.value)" :checked="current==item.value" style="margin-right:8px;" v-for="(item,index) in options" :key="index">
                      {{item.text}}
                  </el-check-tag>
              </div>
          </div>
      </template>
      <div ref="el" id="chart" style="width:100%; height:300px;">

      </div>
  </el-card>
</template>
<script setup>
import {ref,onMounted,onBeforeUnmount} from"vue";
import * as echarts from 'echarts';
import{getStatistics3} from "~/api/index.js";
import { useResizeObserver } from '@vueuse/core'
const current=ref("week")
const options=[
    {
        text:'近一个月',
        value:"month"
    },
    {
        text:'近一周',
        value:"week"
    },
    {
        text:'近24小时',
        value:"hour"
    },
]
const handleChoose=(type)=>{
    current.value=type;
    getData();
}
let myChart=null;
let chartDom
onMounted(()=>{
    chartDom=document.getElementById("chart")
    if(chartDom){
        myChart=echarts.init(chartDom);
        getData();
    }
})
function getData(){

    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar'
            }
        ]
    };
    myChart.showLoading();
    // option && myChart.setOption(option);
    getStatistics3(current.value).then((res)=>{
        option.xAxis.data=res.x;
        option.series[0].data=res.y;
        myChart.setOption(option);
    }).finally(()=>{
        myChart.hideLoading();
    })

}
onBeforeUnmount(()=>{
    if(myChart){
        echarts.dispose(myChart)
    }
})
const el=ref(null);
useResizeObserver(el, (entries) => {
    if(chartDom)
        myChart.resize();
})
</script>