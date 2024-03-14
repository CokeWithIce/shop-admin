import axiosH from "~/axiosHelper.js";
export function getSkusList(page){
    return axiosH.get(`/admin/skus/${page}`)
}
export function createSkus(data){
    return axiosH.post(`/admin/skus`,data)
}
export function updateSkus(id,data){
    return axiosH.post(`/admin/skus/${id}`,data)
}
export function deleteSkus(ids){
    ids=!Array.isArray(ids)?[ids]:ids;
    return axiosH.post(`/admin/skus/delete_all`,{ids})
}
export function updateSkusStatus(id,status){
    return axiosH.post(`/admin/skus/${id}/update_status`,{
        status
    })
}
export function setSkusRules(id,rule_ids){
    return axiosH.post(`/admin/skus/set_rules`,{
        id,rule_ids
    })
}