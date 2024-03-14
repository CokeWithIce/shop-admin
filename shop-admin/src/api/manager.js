import axiosH from "~/axiosHelper.js";
import {queryParams} from "~/composables/util.js";
export function login(username,password){
    return axiosH.post('/admin/login',{
        username,
        password
    })
}
export function getInfo(){
    return axiosH.post('/admin/getinfo');
}

export function logout(){
    return axiosH.post('/admin/logout');
}
export function updatepassword(data){
    return axiosH.post("/admin/updatepassword",data)
}
export function getManagerList(page,query={
    limit:10,
    keyword:"ceshi"
}){
    let r=queryParams(query);
    return axiosH.get(`/admin/manager/${page}${r}`)
}

export function updateManagerStatus(id,status){
    return axiosH.post(`/admin/manager/${id}/update_status`,{
        status
    })
}
export function createManager(data){
    return axiosH.post(`/admin/manager`,data)
}
export function updateManager(id,data){
    return axiosH.post(`/admin/manager/${id}`,data)
}
export function deleteManager(id){
    return axiosH.post(`/admin/manager/${id}/delete`)
}