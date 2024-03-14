import {ElNotification, ElMessageBox} from 'element-plus';
import nprogress from "nprogress";

export function toast(message, type = "success", dangerouslyUseHTMLString = false) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}

export function showModal(content = "提示内容", type = "warning", title = "", confirmButtonText = "确定", cancelButtonText = "取消") {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText,
            cancelButtonText,
            type,
        }
    )
}

export function showFullLoading() {
    nprogress.start();
}

export function hideFullLoading() {
    nprogress.done();
}

export function showPrompt(tip, value = "", title = "") {
    return ElMessageBox.prompt(tip, title, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: "",
        inputErrorMessage: '',
        inputValue: value,
    })
}

export function deeplyClone(obj2) {
    let obj1 = {};
    for (const key in obj2) {
        if (typeof obj2[key] != "object") {
            obj1[key] = obj2[key]
        } else if (typeof obj2[key] == "object") {
            obj1[key] = deeplyClone(obj2[key])
        }
    }
    return obj1;
}
export function queryParams(query){
    let q=[];
    for(const key in query){
        if(query[key]){
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r=q.join('&');
    r=r?("?"+r):"";
    return r;
}
export function useArrayMoveUp(arr,index){
    swapArray(arr,index,index-1)
}
export function useArrayMoveDown(arr,index) {
    swapArray(arr,index,index+1)
}
function swapArray(arr,index1,index2){
    arr[index1]=arr.splice(index2,1,arr[index1])[0]
    return arr;
}
export function cartesianProductOf(){
    return Array.prototype.reduce.call(arguments,function(a,b){
        let ret=[];
        a.forEach(function(a){
            b.forEach(function(b){
                ret.push(a.concat(b));
            })
        });
        return ret;
    },[
        []
    ])
}