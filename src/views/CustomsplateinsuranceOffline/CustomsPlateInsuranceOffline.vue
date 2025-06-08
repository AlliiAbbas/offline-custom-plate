<template>
  <div class="compulsory-insurance rounded-3  card my-2" style="border-color: #efefef" dir="rtl">
    <VehicleTypeOffline
        ref="vehicleType"
        :loading="false"
        @getVehicleType="getVehicleType"
        @handelAttachments="handelAttachments"
    />
    <ExtensionsCustomOffline
        ref="extensionsCustom"
        class="p-4"
        :attachments="attachments"
        v-if="attachments"
        v-model="extensionsData"
        @getExtensionsData="getExtensionsData"/>

    <CalcPlate :payload="calculationData" :extensionsData="calculationData?.extensions"  :openModal="openModal" @closePopup="closePopUp" />
    <footer class="card-footer bg-white d-flex justify-content-end border-top rounded-bottom py-3">
      <button class="btn btn-danger  rounded-3 py-2 fw-bold" style="width: 300px;" :disabled="loading" @click="calculate">
        <span v-if="!loading">احسب </span>
        <div v-else class="spinner-border spinner-border-sm" role="status">
        </div>
      </button>
    </footer>

  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import CalcPlate from "../../components/CustomsPlate/Calc/CalcPlate.vue";
import {useStore} from "vuex";
import VehicleTypeOffline from "@/components/CustomsPlate/VehicleTypeOffline.vue";
import ExtensionsCustomOffline from "@/components/CustomsPlate/ExtensionsCustomOffline.vue";
import router from "@/router";
import { saveData } from '@/utils/indexedDB';

const extensionsData= ref(null)
const store = useStore()
const extensionsCustom = ref(null);
const attachments = ref(false)
const vehicleType = ref(null);
const calculationData= ref(null)
const openModal= ref(false)
const loading = ref(false)
const initialLoading = ref(true)
const closePopUp = () => {

  openModal.value = false
  // store.dispatch('Vehicle/setUserData' , null)
  // router.push({name:'OfflinePlate'})

}
function calculate() {
  calculationData.value = null
  extensionsData.value = []
  openModal.value = false
  if(attachments.value){
    loading.value = true
    const data2 = vehicleType.value.getVehicleType();
    const data = extensionsCustom.value.getExtensionsData();
    if(data2 !== undefined && data !== undefined ){
      let selected_data = JSON.parse(JSON.stringify(data.selected))
      let extensions = selected_data.map((e)=>{
        if(e.id === 16){
          return {
            code:e.code,
            custom_value:data.engineCapacity
          }
        }else if(e.id === 19){
          return {
            code: e.code,
            custom_value:data.passengersCount
          }
        }else if(e.id === 24){
          return {
            code: e.code,
            custom_value:data.vehicleWeight
          }
        }else {
          return {
            code:e.code,
            custom_value:null
          }
        }

      })
      let body = {
        vehicle_type:data2.CustomPlate,
        fuel_type:'بنزين',
        to_date:data2.to_date,
        from_date:data2.from_date,
        operation_type:'custom_plate',
        extensions:extensions
      }
      store.dispatch('Vehicle/getCalculationsOffline' , body).then((e)=>{
        calculationData.value = e
        extensionsData.value = e
        openModal.value = true
        loading.value = false
      })
    }
  }else {
    const data = vehicleType.value.getVehicleType();
    if(data !== undefined){
      loading.value = true
      data.operation_type = 'custom_plate'
      data.fuel_type = 'بنزين'
      data.vehicle_type = data.CustomPlate
      store.dispatch('Vehicle/getCalculationsOffline' , data).then((e)=> {
        calculationData.value = e
        console.log(e);
        let user_data = store.getters["Vehicle/getUserData"]

        let data2 = {
          plate: user_data?.plateNumber,
          chassis_id: user_data?.chassisNumber,
          motor_id: user_data?.engineNumber,
          producer: user_data?.brand,
          model: user_data?.model,
          year: user_data?.manufacturingYear,
          from_date: data?.from_date,
          to_date: data.to_date,
          issued_at: '',
          insurance_state: '',
          owner_name: user_data?.ownerName,
          owner_national_id: user_data?.nationalId,
          owner_address: user_data?.address,
          owner_job: user_data?.job,
          owner_phone: user_data?.phoneNumber,
          net_premium: e.base_price,
          tax: e.taxes.total,
          stamp: e.taxes.stamp_tax,
          issue_fees: e.issue_fees,
          total_sum: e.final_total,
          vehicle_license_type_id: null,
          motor_cc: null,
          cylinders: user_data.cylinders,
          fuel_type_id: data.fuel_type,
          vehicle_color: data.vehicle_color,
          vehicle_kg: null,
          wt_kg: null,
          extra_size_percent: null,
          wt_extra: null,
          body_modification_extensions: null,
          passengers: null,
          tractor_parts: null,
          vehicle_shape: null,
          attach_type: null,
          attach_to_date: null,
          attach_serial: null,
          Insurance_entity: null,
          region: null,
          policy_status: null,
          vehicle_type: null,
          traffic_unit: null,
          insurance_last_vendor: user_data?.lastInsuranceCompany,
        }
        let data_to_save = {
          data: data2,
          timestamp: new Date().toISOString()
        }
        console.log('Attempting to save data:', data_to_save);

        // Check network status and handle accordingly
        if (navigator.onLine) {
          // Online - call API
          store.dispatch('Vehicle/resyncCustomPlate', [data2])
              .then(response => {
                console.log('Data synced successfully with server:', response);
              })
              .catch(error => {
                console.error('Error syncing with server:', error);
                // If API call fails, save to IndexedDB as fallback
                saveData(data_to_save)
                    .then((result) => {
                      console.log('Data saved to IndexedDB as fallback with ID:', result);
                    })
                    .catch(indexedDBError => {
                      console.error('Error saving to IndexedDB:', indexedDBError);
                    });
              });
        } else {
          // Offline - save to IndexedDB
          saveData(data_to_save)
              .then((result) => {
                console.log('Data saved successfully to IndexedDB with ID:', result);
              })
              .catch(error => {
                console.error('Error saving data to IndexedDB:', error);
                // Try to save again after a short delay
                setTimeout(() => {
                  saveData(data_to_save)
                      .then((result) => {
                        console.log('Data saved successfully on retry with ID:', result);
                      })
                      .catch(retryError => {
                        console.error('Error saving data on retry:', retryError);
                      });
                }, 1000);
              });
        }
        openModal.value = true
        loading.value = false

      })
    }
  }
}

function getExtensionsData(data) {
  console.log(data);
}

function handelAttachments() {
  attachments.value = !attachments.value
}

function getVehicleType(data) {
  console.log(data)
}

const getUserData = computed(() => store.getters["Vehicle/getUserData"])
console.log(getUserData.value);
if (getUserData.value === null) {
  router.push({name: 'OfflinePlate'})
}
</script>