import axios from 'axios';
const service=axios.create({
    baseURl:"/api",
    // baseURl:"http://ceshi13.dishait.cn",

})
export default service;