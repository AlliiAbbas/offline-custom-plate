import env from '../env';
import axios from 'axios';
const vehicle_api = {
    getVehicleType: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${env.DEVELOPMENT_DOMAIN}/GetCustomPlate`)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.error('API Error:', error.response || error);
                    reject(error);
                });
        });
    },
    GetCustomPlate: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${env.DEVELOPMENT_DOMAIN}/GetCustomPlate`)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.error('API Error:', error.response || error);
                    reject(error);
                });
        });
    },
    GetCustomPlateExtensions: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${env.DEVELOPMENT_DOMAIN}/GetCustomPlateExtensions`)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.error('API Error:', error.response || error);
                    reject(error);
                });
        });
    },
    resyncCustomPlate: (policies) => {
        return new Promise((resolve, reject) => {
            axios.post(`${env.DEVELOPMENT_DOMAIN}/CustomPlateResync`, {
                policies: policies
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                console.error('API Error:', error.response || error);
                reject(error);
            });
        });
    }
};

export default vehicle_api;