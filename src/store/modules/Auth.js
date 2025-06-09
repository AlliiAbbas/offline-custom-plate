
import {loginOffline} from "../../seeder/loginOffline"
const state = {
    user:null
}

const mutations = {

}

const actions = {
    userLoginOffline({ commit }, data) {
        return new Promise(async (resolve, reject) => {
            if(loginOffline.email === data.email && loginOffline.password == data.password) {
                sessionStorage.setItem('token', loginOffline.token);
                sessionStorage.setItem('username', loginOffline.username);
                resolve(true)
            }else {
                resolve(false)
            }
        })
    },

    
}

const getters = {
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}