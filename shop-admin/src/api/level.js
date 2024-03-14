import axiosH from "~/axiosHelper.js";
export function getUserLevelList(page){
    return axiosH.get(`/admin/user_level/${page}`)
}
export function createUserLevel(data){
    return axiosH.post(`/admin/user_level`,data)
}
export function updateUserLevel(id,data){
    return axiosH.post( `/admin/user_level/${id}`,data)
}
export function deleteUserLevel(id){
    return axiosH.post(`/admin/user_level/${id}/delete`,)
}
export function updateUserLevelStatus(id,status){
    return axiosH.post(`/admin/user_level/${id}/update_status`,{
        status
    })
}
