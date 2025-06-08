import offlineCalculations from "../../calculations/offline_calculations";
import {vehiclesType} from '../../seeder/vehiclesTypeOffline'
import {custom_extensions_offline} from '../../seeder/customExtensionsOffline'
import vehicle_api from '../../api/vehicle_api';
import { initDB } from '../../utils/indexedDB';

const state = {
    vehicles_type_offline:vehiclesType,
    custom_extensions_offline:custom_extensions_offline,
    user_data:null
}

const mutations = {
    setUserData(state, payload) {
        state.user_data = payload
    }
}

const actions = {
    getCalculationsOffline({ commit },data) {
        return new Promise(async (resolve, reject) => {
            offlineCalculations.calculate(data).then(response => {
                console.log(response);
                resolve(response)
            }).catch((reason)=>{
                reject(reason)
            })
        })
    },
    setUserData({ commit },data) {
        commit('setUserData', data)
    },
    resyncCustomPlate({ commit }, policies) {
        return new Promise((resolve, reject) => {
            vehicle_api.resyncCustomPlate(policies)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    syncOfflineData({ commit, dispatch }) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if online
                if (!navigator.onLine) {
                    reject(new Error('No internet connection'));
                    return;
                }

                // Get all data from IndexedDB
                const db = await initDB();
                const transaction = db.transaction(['calculations'], 'readonly');
                const store = transaction.objectStore('calculations');
                const request = store.getAll();

                request.onsuccess = async () => {
                    const offlineData = request.result;
                    if (!offlineData || offlineData.length === 0) {
                        resolve({ message: 'No offline data to sync' });
                        return;
                    }

                    // Transform data to match API format
                    const policies = offlineData.map(item => {
                        if (item.data) {
                            return item.data;
                        }
                        return item;
                    });

                    // Send to API
                    try {
                        const response = await dispatch('resyncCustomPlate', policies);
                        
                        // If successful, clear the IndexedDB store
                        const clearTransaction = db.transaction(['calculations'], 'readwrite');
                        const clearStore = clearTransaction.objectStore('calculations');
                        await clearStore.clear();
                        
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                };

                request.onerror = () => {
                    reject(new Error('Failed to read from IndexedDB'));
                };
            } catch (error) {
                reject(error);
            }
        });
    }
}

const getters = {
    customExtensionsOffline: state => state.custom_extensions_offline,
    vehicleType: state => state.vehicles_type.CustomPlate,
    vehicleTypeOffline: state => state.vehicles_type_offline,
    getUserData:state => state.user_data
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} 