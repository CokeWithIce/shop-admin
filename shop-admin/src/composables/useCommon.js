import {ref,reactive,computed} from"vue";
import {toast} from "~/composables/util.js";
import {updateManagerStatus} from "~/api/manager.js";
import{deeplyClone} from "~/composables/util.js";
import {deleteSkus} from "~/api/skus.js";

export function useInitTable(
    opt = {
        searchForm: null,
        getList: null,
        onGetListSuccess: null,
        delete: null,
        updateStatus:null
    }
){
    //search 查询表单必填
    let searchForm=null;
    let resetSearchForm=null;

    const tableData = ref([])
// 分页字段
    const currentPage = ref(1);
    const total = ref(0);
    const limit = ref(10);
    const loading = ref(false);

    // 多选删除功能
    const multiSelectionIds=ref([])
    const multipleTableRef=ref(null);
    function getData(p){
        if(typeof p=="number"){
            currentPage.value=p;
        }
        loading.value=true;
        opt.getList(currentPage.value,searchForm).then((res)=>{
            if(opt.onGetListSuccess&&typeof opt.onGetListSuccess=="function"){
                opt.onGetListSuccess(res);
            }else{
                tableData.value=res.list;
                total.value=res.totalCount
            }

        }).catch(e=>{
            toast("操作失败","error");
            console.log(e);
        }).finally(()=>{
            loading.value=false;
        })
    }
    if(opt.searchForm){
        searchForm=reactive({...opt.searchForm});
        resetSearchForm=()=>{
            for(const key in opt.searchForm){
                searchForm[key]=opt.searchForm[key];
            }
            getData()
        }
    }
    function handleDelete(id){
        loading.value=true;
        opt.delete(id).then((res)=>{
            toast("删除成功");
            getData();
        }).catch((e) => {
            toast("删除失败","error");
            console.log(e)
        }).finally(() => {
            loading.value=false;
        })
    }
    function handleStatusChange(status,row){
        row.statusLoading=true;
        opt.updateStatus(row.id,status).then((res)=>{
            toast("修改状态成功")
            row.status=status;
        }).catch((e) => {
            toast("操作失败","error")
        }).finally(() => {
            row.statusLoading=false;
        })
    }


    function handleSelectionChange(e){
        multiSelectionIds.value=e.map(o=>o.id);
    }
    function handleMultiDelete(){
        loading.value=true;
        console.log(multiSelectionIds.value);
        opt.delete(multiSelectionIds.value).then((res)=>{
            toast("删除成功");
            if(multipleTableRef)
                multipleTableRef.value.clearSelection();
            getData();
        }).finally(()=>{
            loading.value=false;
        })
    }
    getData();
    return {
        searchForm,
        tableData,
        currentPage,
        total,
        limit,
        getData,
        loading,
        resetSearchForm,
        handleDelete,
        handleStatusChange,
        handleSelectionChange,
        handleMultiDelete,
        multipleTableRef,
        multiSelectionIds
    }
}

export function useInitForm(
    opt={
        getData:null,
        create:null,
        update:null,
        form:reactive(null),
        rules: {},
        beforeSubmit:null
    }
){
//表单抽屉组件的字段
    const formDrawerRef=ref(null);
    const formRef=ref(null);
    const form=opt.form;
    const rules=opt.rules;
//标识
    const editId=ref(0);
    const drawerTitle=computed(()=>{
        return editId.value==0?"新增":"修改"
    })


    const formISO=deeplyClone(form);
    function handleSubmit(){
        formRef.value.validate((valid)=>{
            if(!valid)return
            formDrawerRef.value.showLoading();
            let body={}
            if(opt.beforeSubmit&&typeof opt.beforeSubmit=="function"){
                body=opt.beforeSubmit({...form})
            }else{
                body=form;
            }
            let fun;
            if(editId.value==0){
                fun=opt.create(body);
            }else{
                fun=opt.update(editId.value,body)
            }
            fun.then((res)=>{
                toast(drawerTitle.value+"成功");
                opt.getData(editId?false:1);
                formDrawerRef.value.close();
            }).catch((e) => {
                toast(drawerTitle.value+"列表失败","error")
            }).finally(() => {
                formDrawerRef.value.hideLoading();
            })
        })
    }
    function handleCreate(){
        editId.value=0;
        resetForm(formISO);
        formDrawerRef.value.open();
    }

    function handleEdit(row){
        resetForm(row);
        editId.value=row.id;
        formDrawerRef.value.open();
    }
    function resetForm(row=false){
        if(formRef.value){
            formRef.value.clearValidate();
        }
        if(row){
            for(const key in form){
                form[key]=row[key];
            }
        }
    }
    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleSubmit,
        resetForm,
        handleCreate,
        handleEdit,
    }
}