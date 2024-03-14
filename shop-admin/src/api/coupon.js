import axiosH from "~/axiosHelper.js";
export function getCouponList(page){
    return axiosH.get(`/admin/coupon/${page}`)
}
export function createCoupon(data){
    return axiosH.post(`/admin/coupon`,data)
}
export function updateCoupon(id,data){
    return axiosH.post(`/admin/coupon/${id}`,data)
}
export function deleteCoupon(id){
    return axiosH.post(`/admin/coupon/${id}/delete`,)
}
export function updateCouponStatus(id){
    return axiosH.post(`/admin/coupon/${id}/update_status`,{
        status:0
    })
}