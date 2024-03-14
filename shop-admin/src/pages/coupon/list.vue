<template>
    <el-card v-loading="loading" shadow="never" class="border-0">
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="title" label="优惠卷名称" width="350">
                <template #default="{row}">
                    <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText=='领取中'?'active':'inactive'">
                        <h5>{{row.name}}</h5>
                        <small>{{row.start_time}}~{{row.end_time}}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态" width="180"/>
            <el-table-column label="优惠">
                <template #default="{row}">
                    {{row.type==0?"满减¥"+row.value:"折扣"+row.value+"折"}}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量"/>
            <el-table-column prop="use" label="已使用"/>
            <el-table-column #default="scope" label="操作">
                <el-button v-if="scope.row.statusText=='未开始'" @click="handleEdit(scope.row)" type="primary" size="default" text >修改</el-button>
                <el-popconfirm v-if="scope.row.statusText!='领取中'" @confirm="handleDelete(scope.row.id)" title="是否要删除该优惠卷" confirm-button-text="确认"
                               cancel-button-text="取消">
                    <template #reference>
                        <el-button type="primary" size="default" text @click="">删除</el-button>
                    </template>
                </el-popconfirm>
                <el-popconfirm v-if="scope.row.statusText=='领取中'" @confirm="handleStatusChange(0,scope.row)" title="是否让该优惠卷失效" confirm-button-text="失效"
                               cancel-button-text="取消">
                    <template #reference>
                        <el-button :loading="scope.row.statusLoading" type="danger" size="default" @click="">失效</el-button>
                    </template>
                </el-popconfirm>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev,pager, next" :total="total" v-model="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
                <el-form-item label="优惠卷名称" prop="name" style="width:50%">
                    <el-input placeholder="优惠卷名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0">满减</el-radio>
                        <el-radio :label="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value" style="width:50%">
                    <el-input placeholder="面值"  v-model="form.value">
                        <template #append>
                            {{form.type?"折":"元"}}
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动时间" >
                    <el-date-picker
                        v-model="timerange"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        type="datetimerange"
                        range-separator="To"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :editable="false"
                    >

                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发行量" prop="total" style="width:50%">
                    <el-input-number :min="0" :max="10000" placeholder="发行量"  v-model="form.total"></el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price" style="width:50%">
                    <el-input placeholder="最低使用价格"  type="number" v-model="form.min_price">
                        <template #append>
                            元
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order" style="width:50%">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>

                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" :rows="7" placeholder="描述"  v-model="form.desc"></el-input>
                </el-form-item>

            </el-form>
        </FormDrawer>
    </el-card>

</template>
<script setup>
import {ref,reactive,computed} from "vue";
import {updateCouponStatus,getCouponList,createCoupon,updateCoupon,deleteCoupon} from "~/api/coupon.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import {useInitForm, useInitTable} from "~/composables/useCommon.js";
const {
    tableData,
    currentPage,
    total,
    limit,
    getData,
    loading,
    resetSearchForm,
    handleDelete,
    handleStatusChange
} = useInitTable({
    "getList":getCouponList,
    delete:deleteCoupon,
    onGetListSuccess: function(res){
        tableData.value=res.list.map(o=>{
            o.statusText=formatStatus(o);
            o.statusLoading=false;
            return o;
        })
        total.value=res.totalCount;
    },
    updateStatus:updateCouponStatus,
});
const {
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
}=useInitForm(
    {
        getData,
        update : updateCoupon,
        create: createCoupon,
        form:reactive({
            name:"",
            type:0,
            value:0,
            total:100,
            min_price:0,
            start_time:"",
            end_time:"",
            order:"",
            desc:""
        }),
        rules:{
            name:[
                {required: true, message: '优惠卷必须有名称', trigger: 'blur'},
            ],
            type:[
                {required: true, message: '类型必填', trigger: 'blur'},
            ],
            value:[
                {required: true, message: '面值必填', trigger: 'blur'},
            ],
            total:[
                {required: true, message: '发行量必填', trigger: 'blur'},
            ],
            start_time:[
                {required: true, message: '开始时间必填', trigger: 'blur'},
            ],
            end_time:[
                {required: true, message: '结束时间必填', trigger: 'blur'},
            ],
            order:[
                {required: true, message: '排序必填', trigger: 'blur'},
            ]
        },
        beforeSubmit:function(opt){
            console.log(typeof opt.start_time);
            if(typeof opt.start_time!="number")
                opt.start_time=new Date(opt.start_time).getTime();
            if(typeof opt.end_time!="number")
                opt.end_time=new Date(opt.end_time).getTime();

            console.log(typeof opt.start_time);
            return opt;
        }
    }
);
const timerange=computed({
    get(){
        return form.start_time&&form.end_time?[form.start_time,form.end_time]:[];
    },
    set(val){
        form.start_time=val[0];
        form.end_time=val[1];
    }
})

function formatStatus(row){
    let s="领取中";
    let start_time=new Date(row.start_time).getTime()
    let now=(new Date().getTime())
    let end_time=new Date(row.end_time).getTime();
    if(start_time>now){
        s="未开始"
    }
    else if(end_time<now){
        s="已结束"
    }
    if(row.status==0){
        s="已失效";
    }
    return s;
}
</script>
<style scoped>
.active{
    @apply border-rose-500 bg-rose-50 text-red-400;
}
.inactive{
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>