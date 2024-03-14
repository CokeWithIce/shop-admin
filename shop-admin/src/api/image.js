import axiosH from "~/axiosHelper.js";
export  function getImageList(id,page=1){
    return axiosH.get(`/admin/image_class/${id}/image/${page}`);
}
export  function updateImage(id,name){
    return axiosH.post(`/admin/image/${id}`, {name});
}
export  function deleteImage(ids){
    return axiosH.post(`/admin/image/delete_all`,{ids});
}
export const uploadImageAction="/api/admin/image/upload";