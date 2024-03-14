import {nextTick, ref,computed} from "vue";
import {
    createGoodsSkusCard,
    updateGoodsSkusCard,
    deleteGoodsSkusCard,
    sortGoodsSkusCard,
    createGoodsSkusCardValue,
    updateGoodsSkusCardValue,
    deleteGoodsSkusCardValue,
    chooseAndSetGoodsSkusCard
} from "~/api/goods.js";
import {
    useArrayMoveUp,
    useArrayMoveDown,
    cartesianProductOf
} from "~/composables/util.js";


export const goodsId=ref(0);
export const sku_card_list=ref([]);
export const sku_list=ref([]);
export function initSkuCardList(d){
    sku_card_list.value=d.goodsSkusCard.map(item=>{
        item.text=item.name;
        item.loading=false;
        item.goodsSkusCardValue.map(v=>{
            v.text=v.value||"属性值";
            return v;
        })
        return item;
    })
    console.log(d);
    sku_list.value=d.goodsSkus;
}
export function initSkusCardItem(id){
    const item=sku_card_list.value.find(o=>o.id==id);
    const inputValue = ref('')
    const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
    const inputVisible = ref(false)
    const InputRef = ref(null);
    const loading=ref(false);


    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }

    const handleInputConfirm = () => {
        if(!inputValue.value){
            inputVisible.value=false;
            return ;
        }
        loading.value=true;
        createGoodsSkusCardValue({
            goods_skus_card_id:id,
            name:item.name,
            order:50,
            value:inputValue.value,
        }).then((res)=>{
            item.goodsSkusCardValue.push({
                ...res,
                text:res.value,
            })
            console.log(res);
            getTableData();
        }).finally(()=>{
            inputVisible.value = false
            inputValue.value = ''
            loading.value=false;
        })


    }
    function handleChange(value,tag){
        loading.value=true;
        updateGoodsSkusCardValue(tag.id,{
            goods_skus_card_id:id,
            name:item.name,
            order:tag.order,
            value:value,
        }).then((res)=>{
            tag.value=value;
            getTableData();
        }).catch((e)=>{
            tag.text=tag.value;
        }).finally(()=>{
            loading.value=false;
        })

    }
    function handleClose (tag) {
        loading.value=false;
        deleteGoodsSkusCardValue(tag.id).then((res)=>{
            let i=item.goodsSkusCardValue.findIndex(o=>o.id==tag.id);
            if(i!=-1){
                item.goodsSkusCardValue.splice(i,1);
            }
            getTableData();
        }).catch((e)=>{
            tag.text=tag.value;
        }).finally(()=>{
            loading.value=false;
        })
    }
    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        loading,
        handleChange,
    }
}
export const btnLoading=ref(false);
export const bodyLoading=ref(false);
export function addSkuCardEvent(data){
    btnLoading.value=true;
    createGoodsSkusCard({
        goods_id:goodsId.value,
        name:"规格选项",
        order:50,
        type:0,
    }).then((res)=>{
        sku_card_list.value.push({
            ...res,
            text:res.name,
            loading:false,
            goodsSkusCardValue:[]
        })
    }).finally(()=>{
        btnLoading.value=false;

    });
}
export function handleUpdate(item){
    item.loading=false;
    updateGoodsSkusCard(item.id,{
        "goods_id":item.goods_id,
        "name":item.text,
        "order":item.order,
        "type":0,
    }).then(res=>{

        item.name=item.text;
    }).catch(e=>{
        item.text=item.name;
    }).finally(()=>{
        item.loading=false;
    })
}

export function handleDelete(item,emit){
    item.loading=true;
    deleteGoodsSkusCard(item.id).then(res=>{
        let a=sku_card_list.value.findIndex(o=>o.id==item.id);
        if(a!=-1){
            sku_card_list.value.splice(a,1);
        }
        getTableData();
    })
}
export function handleChooseSetGoodsSkusCard(id,data){
    let item=sku_card_list.value.find(o=>o.id==id);
    chooseAndSetGoodsSkusCard(id,data).then((res)=>{
        item.loading=true;
        item.name=item.text=res.goods_skus_card.name;
        item.goodsSkusCardValue=res.goods_skus_card_value.map(o=>{
            o.text=o.value||"属性值";
            return o;
        })
        getTableData();
    }).catch((e)=>{

    }).finally(()=>{
        item.loading=false;
    })
}
export function sortCard(action,index){
    bodyLoading.value=true;
    let olist=JSON.parse(JSON.stringify(sku_card_list.value));
    let func=action=="up"?useArrayMoveUp:useArrayMoveDown;
    func(olist,index)
    let sortdata=olist.map((o,i)=>{
        return {
            id:o.id,
            order:i+1,
        }
    })
    sortGoodsSkusCard({sortdata}).then((res)=>{
        func(sku_card_list.value,index);
        getTableData();
    }).finally(()=>{
        bodyLoading.value=false;
    })
}
export function initSkuTable(){
    const skuLabels=computed(()=> {
        let a=sku_card_list.value.filter(v=>{
            if(v.goodsSkusCardValue&&v.goodsSkusCardValue.length>0)
                return v;
        })
        return a;
    })
    const tableThs=computed(()=>{
        let length=skuLabels.value.length;
        return [
            {
                name:"商品规格",
                colspan:length,
                width:"",
                rowspan:length>0?1:2,
            },
            {
                name:"销售价",
                width:"100",
                rowspan:2,
            },
            {
                name:"市场价",
                width:"100",
                rowspan:2,

            },
            {
                name:"成本价",
                width:"100",
                rowspan:2,

            },
            {
                name:"库存",
                width:"100",
                rowspan:2,

            },
            {
                name:"体积",
                width:"100",
                rowspan:2,

            },
            {
                name:"重量",
                width:"100",
                rowspan:2,

            },
            {
                name:"编码",
                width:"100",
                rowspan:2,

            },

        ]
    })
    return {
        skuLabels,
        tableThs,
        sku_list,
    }
}
export function getTableData(){
    setTimeout(function(){
        if(sku_card_list.value.length===0){
            return [];
        }
        let list=[];
        sku_card_list.value.forEach(v=>{
            if(v.goodsSkusCardValue&&v.goodsSkusCardValue.length>0){
                list.push(v.goodsSkusCardValue);
            }
        })
        if(list.length==0){
            return [];
        }
        let arr=cartesianProductOf(...list);
        console.log(arr);
        let beforeSkuList=JSON.parse(JSON.stringify(sku_list.value)).map(v=>{
            if(!Array.isArray(v.skus)){
                v.skus=Object.keys(v.skus).map(k=>v.skus[k]);
            }
            v.skusId=v.skus.sort((a,b)=>a.id-b.id).map(s=>s.id).join(",")
            return v
        })
        sku_list.value=[];
        sku_list.value=arr.map(skus=>{
            let o=getBeforeSkuItem(JSON.parse(JSON.stringify(skus)),beforeSkuList);
            return{
                code:o?.code||'',
                cprice:o?.cprice||'',
                goods_id:goodsId.value,
                image:o?.image||"",
                oprice:o?.oprice||0,
                pprice:o?.pprice||0,
                skus,
                stock:o?.stock||0,
                volume:o?.volume||0,
                weight:o?.weight||0,
            }
        })
    },200)
    function getBeforeSkuItem(skus,beforeSkuList){
        let skusId=skus.sort((a,b)=>a.id-b.id).map(s=>s.id).join(",");
        return beforeSkuList.find(v=>{
            if(skus.length>v.skus.length){
                return skusId.indexOf(v.skusId)!=-1;
            }
            return v.skusId.indexOf(skusId)!=-1;
        })
    }
}