import axiosH from "~/axiosHelper.js";
import {queryParams} from "~/composables/util.js";
export function getUserList(page,query={
    limit:10,
    keyword:"ceshi"
}){
    let r=queryParams(query);
    return axiosH.get(`/admin/user/${page}${r}`)
}

export function updateUserStatus(id,status){
    return axiosH.post(`/admin/user/${id}/update_status`,{
        status
    })
}
export function createUser(data){
    return axiosH.post(`/admin/user`,data)
}
export function updateUser(id,data){
    return axiosH.post(`/admin/user/${id}`,data)
}
export function deleteUser(id){
    return axiosH.post(`/admin/user/${id}/delete`)
}