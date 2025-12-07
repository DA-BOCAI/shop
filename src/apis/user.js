import http from "@/utils/http";

/**
 * @description: 根据user对象进行登录
 * @param {Number} id 分类id
 * @return {*}
 */
export function loginAPI(user){
    return http.post('/login',user);
}

export const getLikeListAPI = ({ limit = 4 }) => {
    return http.get('/goods/relevant',{params:{limit}});
}