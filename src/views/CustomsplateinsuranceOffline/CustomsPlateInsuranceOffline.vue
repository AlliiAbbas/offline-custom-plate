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

    <CalcPlate 
      :payload="calculationData" 
      :extensionsData="calculationData?.extensions"  
      :openModal="openModal" 
      @closePopup="closePopUp"
      :onConfirmPayment="confirmPayment"
      :loading="loading"
    />
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
import { saveData, getLastCode, saveLastCode } from '@/utils/indexedDB';
import { decryptObjectFields, getEncryptedFields } from '@/utils/encryption';

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
  loading.value = false
  // إعادة توجيه إلى الصفحة الرئيسية بعد تأكيد الدفع
  router.push({name:'OfflinePlate'})
}
function calculate() {
  let user_data1 = store.getters["Vehicle/getUserData"]
  if(user_data1 === null){
    router.push({name:'OfflinePlate'})
  }else {
  calculationData.value = null
  extensionsData.value = []
  openModal.value = false
  loading.value = true
  if(attachments.value){
    const data2 = vehicleType.value.getVehicleType();
    const data = extensionsCustom.value.getExtensionsData();
    
    // التحقق من وجود بيانات صحيحة
    if (!data || data === null || !data.selected || data.selected.length === 0) {
      loading.value = false
      return
    }
    if(data2 !== undefined){
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
      let body= {
        vehicle_type:data2.CustomPlate,
        fuel_type:'بنزين',
        to_date:data2.to_date,
        from_date:data2.from_date,
        operation_type:'custom_plate',
        extensions:extensions
      }
      store.dispatch('Vehicle/getCalculationsOffline' , body).then(async (e) => {
        calculationData.value = e
        extensionsData.value = e
        openModal.value = true
        loading.value = false
      })

    } else {
      loading.value = false
    }
  }else {
    const data = vehicleType.value.getVehicleType();
    if(data !== undefined){
      data.operation_type = 'custom_plate'
      data.fuel_type = 'بنزين'
      data.vehicle_type = data.CustomPlate
      store.dispatch('Vehicle/getCalculationsOffline' , data).then(async (e) => {
        console.log(data);
        calculationData.value = e
        console.log(e);
        openModal.value = true
        loading.value = false
      })
    } else {
      loading.value = false
    }
  }
  }
}

// دالة جديدة لحفظ البيانات عند تأكيد الدفع
async function confirmPayment() {
  loading.value = true
  
  try {
    let user_data = store.getters["Vehicle/getUserData"]
    let data2 = null
    
    if(attachments.value){
      const vehicleData = vehicleType.value.getVehicleType();
      const extensionsData = extensionsCustom.value.getExtensionsData();
      
      let selected_data = JSON.parse(JSON.stringify(extensionsData.selected))
      let extensions = selected_data.map((e)=>{
        if(e.id === 16){
          return {
            code:e.code,
            custom_value:extensionsData.engineCapacity
          }
        }else if(e.id === 19){
          return {
            code: e.code,
            custom_value:extensionsData.passengersCount
          }
        }else if(e.id === 24){
          return {
            code: e.code,
            custom_value:extensionsData.vehicleWeight
          }
        }else {
          return {
            code:e.code,
            custom_value:null
          }
        }
      })
      
      // إنشاء نص نوع الملحق من الملحقات المختارة
      const attachTypeNames = selected_data.map(ext => ext.name_ar).join(' + ');
      
      data2 = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        plate: user_data?.plateNumber,
        code: null,
        chassis_id: user_data?.chassisNumber,
        motor_id: user_data?.engineNumber,
        producer: user_data?.brand,
        model: user_data?.model,
        year: user_data?.manufacturingYear,
        from_date: vehicleData?.from_date,
        to_date: vehicleData.to_date,
        issued_at:new Date().toISOString().split('T')[0],
        insurance_state: 'New',
        owner_name: user_data?.ownerName,
        owner_national_id: user_data?.nationalId,
        owner_address: user_data?.address,
        owner_job: user_data?.job,
        owner_phone: user_data?.phoneNumber,
        net_premium: calculationData.value.base_price,
        tax: calculationData.value.taxes.total,
        stamp: calculationData.value.taxes.stamp_tax,
        admin_fees:calculationData.value.taxes.supervision_tax,
        audit_fees:calculationData.value.taxes.review_tax,
        issue_fees: calculationData.value.issue_fees,
        total_sum: calculationData.value.final_total,
        vehicle_license_type: vehicleData.vehicle_type,
        motor_cc: null,
        cylinders: user_data.cylinders,
        fuel_type_id: 'بنزين',
        vehicle_color: vehicleData.vehicle_color,
        vehicle_kg: null,
        wt_kg: null,
        extra_size_percent: null,
        wt_extra: null,
        body_modification_extensions: [],
        passengers: null,
        tractor_parts: null,
        vehicle_shape: null,
        attach_type: attachTypeNames,
        attach_to_date: null,
        attach_serial: null,
        Insurance_entity: null,
        region: null,
        policy_status: null,
        vehicle_type: null,
        traffic_unit: sessionStorage.getItem('location'),
        insurance_last_vendor: user_data?.lastInsuranceCompany,
        status: 'done',
      }
    } else {
      const vehicleData = vehicleType.value.getVehicleType();
      
      data2 = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        plate: user_data?.plateNumber,
        chassis_id: user_data?.chassisNumber,
        motor_id: user_data?.engineNumber,
        producer: user_data?.brand,
        model: user_data?.model,
        year: user_data?.manufacturingYear,
        from_date: vehicleData?.from_date,
        to_date: vehicleData.to_date,
        issued_at: new Date().toISOString().split('T')[0],
        insurance_state: 'NEW',
        owner_name: user_data?.ownerName,
        owner_national_id: user_data?.nationalId,
        owner_address: user_data?.address,
        owner_job: user_data?.job,
        owner_phone: user_data?.phoneNumber,
        net_premium: calculationData.value.base_price,
        tax: calculationData.value.taxes.total,
        stamp: calculationData.value.taxes.stamp_tax,
        issue_fees: calculationData.value.issue_fees,
        admin_fees:calculationData.value.taxes.supervision_tax,
        audit_fees:calculationData.value.taxes.review_tax,
        total_sum: calculationData.value.final_total,
        vehicle_license_type: vehicleData?.CustomPlate,
        motor_cc: null,
        cylinders: user_data.cylinders,
        fuel_type_id: 'بنزين',
        vehicle_color: vehicleData.vehicle_color,
        vehicle_kg: null,
        wt_kg: null,
        extra_size_percent: null,
        wt_extra: null,
        body_modification_extensions: [],
        passengers: null,
        tractor_parts: null,
        vehicle_shape: null,
        attach_type: null,
        attach_to_date: null,
        attach_serial: null,
        Insurance_entity: null,
        region: null,
        policy_status: null,
        vehicle_type: user_data?.licenseType,
        traffic_unit: sessionStorage.getItem('location'),
        insurance_last_vendor: user_data?.lastInsuranceCompany,
        status: 'done'
      }
    }

    // إضافة الكود
    try {
      const lastCode = await getLastCode();
      if (!lastCode) {
        let code = parseInt(sessionStorage.getItem('code'));
        data2.code = code
        await saveLastCode(code);
      } else {
        data2.code = lastCode + 1;
        await saveLastCode(data2.code);
      }
    } catch (error) {
      console.error('Error handling code:', error);
    }

    let data_to_save = {
      data: JSON.parse(JSON.stringify(data2)),
      timestamp: new Date().toISOString()
    }
    console.log('Attempting to save data:', data_to_save);

    // التحقق من حالة الاتصال والتعامل معها
    if (navigator.onLine) {
      // أونلاين - استدعاء API
      const decryptedData = await decryptObjectFields(data2, getEncryptedFields());
      await store.dispatch('Vehicle/resyncCustomPlate', [decryptedData]);
      console.log('Data synced successfully with server');
    } else {
      // أوفلاين - حفظ في IndexedDB
      await saveData(data_to_save);
      console.log('Data saved successfully to IndexedDB');
    }
    
    loading.value = false
    // إغلاق المودال وإعادة التوجيه
    closePopUp()
    
  } catch (error) {
    console.error('Error in confirmPayment:', error);
    loading.value = false
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