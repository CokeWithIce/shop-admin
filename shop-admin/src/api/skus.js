import axiosH from "~/axiosHelper.js";
export function getRoleList(page){
    return axiosH.get(`/admin/role/${page}`)
}
export function createRole(data){
    return axiosH.post(`/admin/role`,data)
}
export function updateRole(id,data){
    return axiosH.post(`/admin/role/${id}`,data)
}
export function deleteRole(id){
    return axiosH.post(`/admin/role/${id}/delete`,)
}
export function updateRoleStatus(id,status){
    return axiosH.post(`/admin/role/${id}/update_status`,{
        status
    })
}
export function setRoleRules(id,rule_ids){
    return axiosH.post(`/admin/role/set_rules`,{
        id,rule_ids
    })
}