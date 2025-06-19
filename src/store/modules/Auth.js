import {loginOffline} from "../../seeder/loginOffline"
import { saveUser, clearUserData, saveLastCode } from "../../utils/indexedDB"

const state = {
    user:null
}

const mutations = {
    setUser(state, user) {
        state.user = user
    }
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
                try {
                    sessionStorage.setItem('token', auth_data.token);
                    sessionStorage.setItem('username', auth_data.username);
                    sessionStorage.setItem('location', auth_data.location);
                    sessionStorage.setItem('code', auth_data.code);
                    await saveUser(auth_data);
                    commit('setUser', auth_data);
                    resolve(true)
                } catch (error) {
                    console.error('Error saving user data:', error);
                    resolve(false)
                }
            } else {
                resolve(false)
            }
        })
    },

    logout: function ({commit}) {
        return new Promise(async (resolve) => {
            try {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('location');
                await clearUserData();
                commit('setUser', null);
                resolve(true);
            } catch (error) {
                console.error('Error during logout:', error);
                resolve(false);
            }
        });
    }
}

const getters = {
    getUser: (state) => state.user
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}