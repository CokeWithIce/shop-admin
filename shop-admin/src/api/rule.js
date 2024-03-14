import axiosH from "~/axiosHelper.js";
export function getRuleList(page){
    return axiosH.get(`/admin/rule/${page}`)
}
export function createRule(data){
    return axiosH.post(`/admin/rule`,data)
}
export function updateRule(id,data){
    return axiosH.post(`/admin/rule/${id}`,data)
}
export function deleteRule(id){
    return axiosH.post(`/admin/rule/${id}/delete`)
}
export function updateRuleStatus(id,status){
    return axiosH.post(`/admin/rule/${id}/update_status`,{
        status
    })
}