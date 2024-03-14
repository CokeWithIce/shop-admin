import store from"~/store"
function hasPermission (value,el=false){
    if(!Array.isArray(value)){
        throw new Error(`需要配置权限，例如v-permission="['getStatistics3,GET']"`)
    }
    console.log(store.state.ruleNames);
    console.log(value.findIndex(v=>store.state.ruleNames.includes(v)))
    const hasAuth=value.findIndex(v=>store.state.ruleNames.includes(v))!=-1
    if(el &&!hasAuth){
        el.parentNode&&el.parentNode.removeChild(el);
    }
    return hasAuth;
}
export default{
    install(app){
        app.directive("permission",{
            mounted(el,binding){
                hasPermission(binding.value,el);
            }
        })
    }
}