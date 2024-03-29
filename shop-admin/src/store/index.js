import {createStore} from "vuex";
import {getInfo} from "~/api/manager.js";
import {setToken,removeToken} from "~/composables/auth.js";
import {login} from "~/api/manager.js"
const store=createStore({
    state(){
        return {
            user:{},
            asideWidth:"250px",
            menus:[],
            ruleNames:[]
        }
    },
    mutations:{
        SET_USERINFO(state,user){
            state.user=user
        },
        handleAsideWidth(state){
            state.asideWidth=state.asideWidth=="250px"?"60px":"250px"
        },
        SET_MENUS(state,menus){
            state.menus=menus;
        },
        SET_RULENAMES(state,ruleNames){
            state.ruleNames=ruleNames;
        }
    },
    actions: {
        getinfo({commit}) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    commit("SET_USERINFO", res)
                    commit("SET_MENUS",res.menus);
                    commit("SET_RULENAMES",res.ruleNames);
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        login({commit}, {username, password}) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res);
                }).catch(error => reject(error))
            })
        },
        logout({commit}){
            removeToken();
            commit("SET_USERINFO",{})
        }
    }
})
export default store