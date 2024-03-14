<template>
    <div v-if="modelValue && preview">
        <el-image v-if="typeof modelValue=='string'" :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2 flex items-center justify-center"></el-image>
        <div v-else class="flex flex-wrap">
            <div
                    v-for="(url,index) in modelValue"
                    class="relative mx-1 mb-2 w-[100px] h-[100px]"
                    :key="index"
            >
                <el-icon @click="removeImage(url)" class="rounded-full cursor-pointer bg-white absolute right-[5px] top-[5px]" style="z-index:100"><CircleClose/></el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2 flex items-center justify-center"/>
            </div>
        </div>
    </div>
  <div v-if="preview" class="choose-image-btn"  @click="open">
      <el-icon :size="25" class="text-gray-500">
        <Plus/>
      </el-icon>
  </div>
  <el-dialog
          title="选择图片"
          v-model="dialogVisible"
          width="80%"
          top="5vh"
  >
    <span>
      <el-container class="bg-white rounded" style="height:70vh">
        <el-header class="image-header">
            <el-button type="primary" size="small" @click="handleOpenCreate">
                新增图片分类
            </el-button>
            <el-button type="warning" size="small" @click="handleOpenUpload">
                上传图片
            </el-button>
        </el-header>
        <el-container>
            <ImageAside @change="handleAsideChange" ref="ImageAsideRef"></ImageAside>
            <image-main :limit="limit" :open-choose="true" @choose="handleChoose" ref="ImageMainRef"></image-main>
        </el-container>
    </el-container>
    </span>
      <template #footer>
          <span>
              <el-button @click="close">取消</el-button>
              <el-button @click="submit" type="primary">确认</el-button>
          </span>
      </template>
  </el-dialog>
</template>
<script setup>
import {ref} from"vue";
import ImageAside from "~/components/image/ImageAside.vue";
import ImageMain from "~/components/image/ImageMain.vue";
import {toast} from "~/composables/util.js";

const ImageAsideRef=ref(null);
const ImageMainRef=ref(null);
const dialogVisible=ref(null);
const props=defineProps({
    modelValue:[String,Array],
    limit:{
        type:Number,
        default:1
    },
    preview:{
        type:Boolean,
        default:true,
    }
})
let urls=[];
const callBackFun=ref(null);
const emit=defineEmits(["update:modelValue"])
function  handleOpenCreate() {return ImageAsideRef.value.handleCreate()}
function handleAsideChange(image_class_id){
    ImageMainRef.value.loadData(image_class_id);
}
function handleOpenUpload(){
    ImageMainRef.value.openUploadFile();
}

function submit(){
    let value=[];
    if(props.limit==1){
        value=urls[0];
    }else{
      value=props.preview?[...props.modelValue,...urls]:[...urls]
        if(value.length>props.limit){
            let limit=props.preview?props.limit-props.modelValue.length:props.limit;
            return toast(`最多还能选择${limit}张`)
        }
    }
    if(value&&props.preview){
        emit("update:modelValue",value);
    }
    if(!props.preview &&typeof callBackFun.value=="function"){
      callBackFun.value(value);
    }
    close();
}
function handleChoose(e){
    urls=e.map(o=>o.url);
}
function open(callBack=null){
    callBackFun.value=callBack;
    dialogVisible.value=true;
}
function close(){
    dialogVisible.value=false;
}
function removeImage(url){
    let a=props.modelValue.filter(u=>{
        return u!=url;
    })
    emit("update:modelValue",a);
}
defineExpose({
    open
})
</script>
<style scoped>
  .choose-image-btn{
      @apply w-[100px] h-[100px] rounded border flex items-center justify-center cursor-pointer hover:(bg-gray-100);
  }
  .image-header{
      border-bottom:1px solid #eee;
      @apply flex items-center
  }
  .image-aside{
      border-right:1px solid #eee;
      position:relative;
  }
  .image-main{
      position:relative;
  }
  .image-aside .top,.image-main .top{
      position: absolute;
      top:0;
      right:0;
      left:0;
      bottom:50px;
      overflow-y:scroll;
  }
  .image-aside .bottom,.image-main .bottom{
      bottom:0;
      position: absolute;
      right:0;
      left:0;
      height:50px;
      @apply flex items-center justify-center;
  }

</style>