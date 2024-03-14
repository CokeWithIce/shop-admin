import axiosH from "~/axiosHelper.js";
export function getStatistics1(){
    return axiosH.get('/admin/statistics1');
}
export function getStatistics2(type){
    return axiosH.get('/admin/statistics2');
}
export function getStatistics3(type){
    return axiosH.get('/admin/statistics3?type='+type);
}