<template>
    <el-main class="image-main" v-loading="loading" >
        <div class="top p-3">
            <el-row :gutter="10" class="">
                <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
                        <el-card :class="{'border-blue-500':item.checked}" :body-style="{'padding':0}" shadow="hover" class="relative mb-3 p-0">
                            <el-image :preview-src-list="[item.url]" :initial-index="0" class="w-full h-[150px]" :src="item.url" fit="cover" :lazy="true"></el-image>
                            <div class="image-title">
                                {{item.name}}
                            </div>
                            <div class="flex items-center justify-center p-2">
                                <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChange(item)">

                                </el-checkbox>
                                <el-button @click="handleEdit(item)" type="primary" size="small" text>重命名</el-button>
                                <el-popconfirm @confirm="handleDelete(item.id)" confirm-button-text="确认" cancel-button-text="取消" title="是否删除该图片">
                                    <template #reference>
                                        <el-button class="!m-0" type="danger" size="small" text>删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager, next" :total="total" v-model="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
        <el-drawer v-model="drawer" title="上传组件" >
            <upload-file :data="{image_class_id}" @success="handleUploadSuccess">

            </upload-file>
        </el-drawer>

    </el-main>
</template>
<script setup>
import {ref,computed} from"vue"
import {getImageList,updateImage,deleteImage} from "~/api/image.js";
import {showPrompt,toast} from "~/composables/util.js";
import UploadFile from "~/components/image/UploadFile.vue";
// 分页字段
const currentPage=ref(1);
const total=ref(0);
const limit=ref(10);
const loading=ref(false);

// 数组接收图片list
const list=ref([])
// 接受当前的图片分类
const image_class_id=ref(0);

// 抽屉组件的变量
const drawer=ref(false);

// 计算属性
const checkedImage=computed(()=>{
    return list.value.filter(o=>o.checked);
})
// 接受父组件传递的属性
const props=defineProps({
    openChoose:{
        type:Boolean,
        default:false
    },
    limit:{
        type:Number,
        default:1,
    }
})
// emit 通知父组件
const emit=defineEmits(["choose"])
function getData(p){
    if(typeof p=="number"){
        currentPage.value=p;
    }
    loading.value=true;
    getImageList(image_class_id.value,currentPage.value).then((res)=>{
        total.value=res.totalCount;
        list.value=res.list.map(o=>{
            o.checked=false;
            return o;
        });
    }).finally(()=>{
        loading.value=false;
    })
}
// 根据费雷ID重新加载图片列表
function loadData(id){
    currentPage.value=1;
    image_class_id.value=id;
    getData()
}
function handleEdit(item){
    showPrompt("重命名",item.name).then(({value})=>{
        loading.value=true;
        updateImage(item.id,value).then((res)=>{
            toast("修改成功");
            getData();
        }).catch(e=>{
            toast("操作失败","error");
            console.log(e);
        }).finally(()=>{
            loading.value=false;
        })
    });
}
function handleDelete(id){
    deleteImage([id]).then((res)=>{
        toast("删除成功");
        getData();
    }).catch((e)=>{
        toast("删除失败","danger");
        console.log(e)
    }).finally(()=>{
        loading.value=false;
    })
}
function openUploadFile(){
    drawer.value=true;
}
function handleUploadSuccess(){
    getData();
}
function handleChange(item){
    if(item.checked&&checkedImage.value.length>props.limit){
        item.checked=false;
        return toast(`最多只能选中${props.limit}张`,"error")
    }
    emit('choose',checkedImage.value);
}
defineExpose({
    loadData,
    openUploadFile
})
</script>
<style scoped>
.image-main{
    position:relative;
}
.image-main .top{
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:50px;
    overflow-y:scroll;
}
.image-main .bottom{
    bottom:0;
    position: absolute;
    right:0;
    left:0;
    height:50px;
    @apply flex items-center justify-center;
}
.image-title{
 position:absolute;
    top:122px;
    left:-1px;
    right:-1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>