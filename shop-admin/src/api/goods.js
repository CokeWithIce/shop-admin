import axiosH from "~/axiosHelper.js";
import {queryParams} from "~/composables/util.js";

export function getGoodsList(page,query={
    limit:10,
    keyword:"ceshi"
}){
    let r=queryParams(query);
    return axiosH.get(`/admin/goods/${page}${r}`)
}

export function updateGoodsStatus(ids,status){
    return axiosH.post(`/admin/goods/changestatus`,{
        ids,
        status
    })
}
export function createGoods(data){
    return axiosH.post(`/admin/goods`,data)
}
export function updateGoods(id,data){
    return axiosH.post(`/admin/goods/${id}`,data)
}
export function deleteGoods(ids){
    if(typeof ids=='number')ids=[ids];
    return axiosH.post(`/admin/goods/delete_all`, {ids})
}
export function restoreGoods(ids){
    if(typeof ids=='number')ids=[ids];
    return axiosH.post(`/admin/goods/restore`, {ids})
}
export function destroyGoods(ids){
    return axiosH.post(`/admin/goods/destroy`, {ids})
}
export function readGoods(id){
    return axiosH.get(`/admin/goods/read/${id}`)
}
export function setGoodsBanner(id,data){
    return axiosH.post(`/admin/goods/banners/${id}`,data)
}
export function updateGoodsSkus(id,data){
    return axiosH.post(`/admin/goods/updateskus/${id}`,data)
}
export function createGoodsSkusCard(data){
    return axiosH.post(`/admin/goods_skus_card`,data)
}
export function updateGoodsSkusCard(id,data){
    return axiosH.post(`/admin/goods_skus_card/${id}`,data)
}
export function deleteGoodsSkusCard(id){
    return axiosH.post(`/admin/goods_skus_card/${id}/delete`)
}
export function sortGoodsSkusCard(data) {
    return axiosH.post(`/admin/goods_skus_card/sort`, data);
}
export function createGoodsSkusCardValue(data){
    return axiosH.post(`/admin/goods_skus_card_value`,data)
}
export function updateGoodsSkusCardValue(id,data){
    return axiosH.post(`/admin/goods_skus_card_value/${id}`,data)
}
export function deleteGoodsSkusCardValue(id){
    return axiosH.post(`/admin/goods_skus_card_value/${id}/delete`)
}
export function  chooseAndSetGoodsSkusCard(id,data){
    return axiosH.post(`/admin/goods_skus_card/${id}/set`,data)

}