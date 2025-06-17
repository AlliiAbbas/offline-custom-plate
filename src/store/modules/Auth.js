
import {loginOffline} from "../../seeder/loginOffline"
const state = {
    user:null
}

const mutations = {

}

const actions = {
    userLoginOffline: function ({commit}, data) {
        return new Promise(async (resolve, reject) => {
            let auth_data = {}
            let auth = loginOffline.find((e) => {
               if(e.email === data.email && e.password == data.password){
                   auth_data = e
                   return true
               }
            })
            if (auth) {
                sessionStorage.setItem('token', auth_data.token);
                sessionStorage.setItem('username', auth_data.username);
                resolve(true)
            } else {
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