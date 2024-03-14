import axiosH from "~/axiosHelper.js";
export  function getImageClassList(page=":page?limit=10"){
    return axiosH.get("/admin/image_class/"+page);
}
export  function createImageClass(data){
    return axiosH.post("/admin/image_class",data);
}
export  function updateImageClass(id,data){
    return axiosH.post("/admin/image_class/"+id,data);
}
export  function deleteImageClass(id){
    return axiosH.post(`/admin/image_class/${id}/delete`);
}