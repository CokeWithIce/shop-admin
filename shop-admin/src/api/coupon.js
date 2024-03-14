import axiosH from "~/axiosHelper.js";
export function getNoticeList(page){
    return axiosH.get(`/admin/notice/${page}`)
}
export function createNotice(data){
    return axiosH.post(`/admin/notice`,data)
}
export function updateNotice(id,data){
    return axiosH.post(`/admin/notice/${id}`,data)
}
export function deleteNotice(id){
    return axiosH.post(`/admin/notice/${id}/delete`,)
}