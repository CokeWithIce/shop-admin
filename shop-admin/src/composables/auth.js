import { useCookies } from '@vueuse/integrations/useCookies'
const TokenKey="admin-token";
const cookie=useCookies();


export function getToken(){
    return cookie.get(TokenKey)
}

export function setToken(val) {
    return cookie.set(TokenKey, val);
}


export function removeToken() {
    return cookie.remove(TokenKey);
}