import axiosH from "~/axiosHelper.js";
export function getCategoryList(){
    return axiosH.get(`/admin/category`)
}
export function createCategory(data){
    return axiosH.post(`/admin/category`,data)
}
export function updateCategory(id,data){
    return axiosH.post(`/admin/category/${id}`,data)
}
export function deleteCategory(id){
    return axiosH.post(`/admin/category/${id}/delete`)
}
export function updateCategoryStatus(id,status){
    return axiosH.post(`/admin/category/${id}/update_status`,{
        status
    })
}
export function getCategoryGoods(id){
    return axiosH.get(`/admin/app_category_item/list?category_id=${id}`)
}
export function deleteCategoryGoods(id){
    return axiosH.post(`/admin/app_category_item/${id}/delete`)
}
export function connectCategoryGoods(data){
    return axiosH.post(`/admin/app_category_item`,data);
}