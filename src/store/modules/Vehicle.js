import offlineCalculations from "../../calculations/offline_calculations";
import {vehiclesType} from '../../seeder/vehiclesTypeOffline'
import {custom_extensions_offline} from '../../seeder/customExtensionsOffline'
import vehicle_api from '../../api/vehicle_api';
import { initCustomPlateDB, initDB } from '../../utils/indexedDB';

const state = {
    vehicles_type_offline:vehiclesType,
    custom_extensions_offline:custom_extensions_offline,
    user_data:null
}

const mutations = {
    setUserData(state, payload) {
        state.user_data = payload
    },
    setVehiclesTypeOffline(state, payload) {
        state.vehicles_type_offline = payload[0]
    },
    setCustomExtensionsOffline(state, payload) {
        state.custom_extensions_offline = payload[0]
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
                        await dispatch('resyncCustomPlate', policies).then(async (response) => {
                            // If successful, clear the IndexedDB store
                            const clearTransaction = db.transaction(['calculations'], 'readwrite');
                            const clearStore = clearTransaction.objectStore('calculations');
                            await clearStore.clear();
                            resolve(response);

                        }).catch((error)=>{
                            reject(error);
                        })


                };

                request.onerror = () => {
                    reject(new Error('Failed to read from IndexedDB'));
                };
            } catch (error) {
                reject(error);
            }
        });
    },
    GetCustomPlate({ commit }) {
        return new Promise((resolve, reject) => {
            vehicle_api.GetCustomPlate()
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    GetCustomPlateExtensions({ commit }) {
        return new Promise((resolve, reject) => {
            vehicle_api.GetCustomPlateExtensions()
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async initializeOfflineData({ commit }) {
        try {
            console.log('Starting to initialize offline data...');
            const db = await initCustomPlateDB();
            const transaction = db.transaction(['customPlate'], 'readonly');
            const store = transaction.objectStore('customPlate');
            const request = store.getAll();

            request.onsuccess = () => {
                const offlineData = request.result;
                console.log('Retrieved offline data:', offlineData);
                if (offlineData && offlineData.length > 0) {
                    // Extract customPlate data
                    const customPlateData = offlineData
                        .filter(item => item.data && item.data.customPlate)
                        .map(item => item.data.customPlate);
                    
                    // Extract customExtensions data
                    const customExtensionsData = offlineData
                        .filter(item => item.data && item.data.extensions)
                        .map(item => item.data.extensions);

                    console.log('Processed customPlate data:', customPlateData);
                    console.log('Processed customExtensions data:', customExtensionsData);

                    commit('setVehiclesTypeOffline', customPlateData);
                    commit('setCustomExtensionsOffline', customExtensionsData);
                } else {
                    console.log('No offline data found in IndexedDB');
                }
            };

            request.onerror = (error) => {
                console.error('Error retrieving offline data:', error);
            };
        } catch (error) {
            console.error('Error initializing offline data:', error);
        }
    },
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