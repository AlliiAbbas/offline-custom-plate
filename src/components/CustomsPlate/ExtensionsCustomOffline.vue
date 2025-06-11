<template>
  <div>
    <div class="pricing-methods-container">
      <label class="pricing-methods-label" for="pricingMethods">اختر ملحق او اكتر</label>
      <multiselect
          id="pricingMethods"
          v-model="selected"
          :class="{'border border-danger rounded-2' : selected_error}"
          :options="pricingMethods"
          track-by="code"
          label="name_ar"
          :multiple="true"
          :tag-placeholder="''"
          placeholder="اختر ملحق او اكتر"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
      >
        <template #selection="{ values, search, isOpen }">
          <span
              v-for="(value, index) in values"
              :key="index"
              class="selected-option"
          >
            {{ value.name_ar }}
            <span class="delete-icon cursor-pointer" @click="removeSelectedItem(value)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path d="M11.5 5.20703L4.5 12.207M4.5 5.20703L11.5 12.207" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </span>
          <span class="badge position-relative left-2" v-if="values.length !== 0">{{ values.length }}</span>
        </template>

        <template #option="props">
          <div class="custom-option">
            <input
                class="mx-2"
                type="checkbox"
                :checked="selected.some((o) => o.code === props.option.code)"
                @change="toggleOption(props.option)"
            />
            <span>{{ props.option.name_ar }}</span>
          </div>
        </template>
      </multiselect>
      <span v-if="selected_error" class="text-danger" style="font-size: 14px">
        من فضلك اختر علي الاقل ملحق.
      </span>
    </div>

    <div class="row">
      <div v-if="showEngineCapacityInput" class="col-sm-12 col-md-4 col-lg-4">
        <div>
          <label class="pricing-methods-label" for="engineCapacity">سعة المحرك الجديدة</label>
          <input
              type="number"
              class="form-control"
              id="engineCapacity"
              placeholder="ادخل سعة المحرك الجديده"
              v-model="engineCapacity"
              :class="{'border border-danger': engineCapacityError}"
              min="1"
              step="1"
              @input="handlePositiveIntegerInput($event, 'engineCapacity')"
          >
          <span v-if="engineCapacityError" class="text-danger" style="font-size: 14px">
            من فضلك ادخل سعة المحرك
          </span>
        </div>
      </div>

      <div v-if="showPassengersCountInput" class="col-sm-12 col-md-4 col-lg-4">
        <label class="pricing-methods-label" for="passengersCount">عدد الركاب الجديد</label>
        <input
            type="number"
            class="form-control"
            id="passengersCount"
            placeholder="ادخل عدد الركاب الجديد"
            v-model="passengersCount"
            :class="{'border border-danger': passengersCountError}"
            min="1"
            step="1"
            @input="handlePositiveIntegerInput($event, 'passengersCount')"
        >
        <span v-if="passengersCountError" class="text-danger" style="font-size: 14px">
          من فضلك ادخل عدد الركاب
        </span>
      </div>

      <div v-if="showVehicleWeightInput" class="col-sm-12 col-md-4 col-lg-4">
        <label class="pricing-methods-label" for="vehicleWeight">الوزن الجديد</label>
        <input
            type="number"
            class="form-control"
            id="vehicleWeight"
            placeholder="ادخل الوزن الجديد"
            v-model="vehicleWeight"
            :class="{'border border-danger': vehicleWeightError}"
            min="1"
            step="1"
            @input="handlePositiveIntegerInput($event, 'vehicleWeight')"
        >
        <span v-if="vehicleWeightError" class="text-danger" style="font-size: 14px">
          من فضلك ادخل الوزن
        </span>
      </div>
    </div>
  </div>
</template>


<script setup >
import {computed, ref, watch} from 'vue';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import {useStore} from "vuex";
const store = useStore()
const pricingMethods = computed(()=> store.getters["Vehicle/customExtensionsOffline"]);
console.log(pricingMethods.value);
const selected = ref([])
const showEngineCapacityInput = ref(false)
const showPassengersCountInput = ref(false)
const showVehicleWeightInput = ref(false)

const engineCapacity = ref(null)
const passengersCount = ref(null)
const vehicleWeight = ref(null)

const engineCapacityError = ref(false)
const passengersCountError = ref(false)
const vehicleWeightError = ref(false)

// watchers
watch(selected, (newValue, oldValue) => {
  showEngineCapacityInput.value = newValue.some((item) => item.code === 'CHANGE_MOTOR_CC')
  showPassengersCountInput.value = newValue.some((item) => item.code === 'PASSENGERS')
  showVehicleWeightInput.value = newValue.some((item) => item.code === 'CHANGE_SIZE')
}, { immediate: true, deep: true });

// methods
function toggleOption(option) {
  const index = selected.value.findIndex((o) => o === option);
  if (index === -1) {
    selected.value.push(option);
  } else {
    selected.value.splice(index, 1);
  }
}
function handlePositiveIntegerInput(event, modelKey) {
  let value = event.target.value;

  value = value.replace(/[^0-9]/g, '');

  const number = parseInt(value);

  if (!isNaN(number) && number >= 1) {
    if (modelKey === 'vehicleWeight') vehicleWeight.value = number.toString();
    else if (modelKey === 'engineCapacity') engineCapacity.value = number.toString();
    else if (modelKey === 'passengersCount') passengersCount.value = number.toString();
  } else {
    if (modelKey === 'vehicleWeight') vehicleWeight.value = '';
    else if (modelKey === 'engineCapacity') engineCapacity.value = '';
    else if (modelKey === 'passengersCount') passengersCount.value = '';
  }
}

function removeSelectedItem(item) {
  const index = selected.value.findIndex((o) => o === item);
  if (index !== -1) {
    selected.value[index].code === 'CHANGE_MOTOR_CC' ? engineCapacity.value = null : null
    selected.value[index].code === 'PASSENGERS' ? passengersCount.value = null : null
    selected.value[index].code === 'CHANGE_SIZE' ? vehicleWeight.value = null : null
    selected.value.splice(index, 1);
  }
}

const selected_error = ref(false)
function getExtensionsData() {
  selected_error.value = false
  engineCapacityError.value = false
  passengersCountError.value = false
  vehicleWeightError.value = false

  if(selected.value.length === 0) {
    selected_error.value = true
    return null
  }

  // Validate inputs based on visibility
  if (showEngineCapacityInput.value && (!engineCapacity.value || isNaN(engineCapacity.value))) {
    engineCapacityError.value = true
  }

  if (showPassengersCountInput.value && (!passengersCount.value || isNaN(passengersCount.value))) {
    passengersCountError.value = true
  }

  if (showVehicleWeightInput.value && (!vehicleWeight.value || isNaN(vehicleWeight.value))) {
    vehicleWeightError.value = true
  }
  if(!engineCapacityError.value && !passengersCountError.value && !vehicleWeightError.value){
    return {
      engineCapacity: engineCapacity.value,
      passengersCount: passengersCount.value,
      vehicleWeight: vehicleWeight.value,
      selected: selected.value
    }
  }else {
    return  undefined
  }

}

defineExpose({
  getExtensionsData
});
</script>



<style>
.multiselect__tag {
  background: #f1f1f1 !important;
  color: #010202 !important;
}

.multiselect__option--highlight {
  background: white !important;
  color: black !important;
}

.multiselect__option--highlight:hover {
  color: black !important;
  background: var(--colors-grey-grey-50, #F1F1F1) !important;
}

.multiselect__option--highlight::after {
  background: white !important;
}

.multiselect__option--highlight::after {
  content: "" !important;
}

.custom-option {
  color: black !important;
}

.custom-option:hover {
  color: black !important;
}

.custom-option input[type="checkbox"] {
  accent-color: var(--primary-500) !important;
}

.multiselect__option--selected {
  background: var(--colors-grey-grey-50, #F1F1F1) !important;
  color: black !important;
}

.multiselect__spinner::before,
.multiselect__spinner::after {
  border-color: var(--primary-500) transparent transparent !important;
}

.multiselect__tag-icon::after {
  color: #808080 !important;
}
</style>

<style scoped>
.pricing-methods-container {
  margin-bottom: 20px;
}

.pricing-methods-label {
  margin-bottom: 0.25rem;
}

.selected-counter {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.badge {
  background-color: #d32f2f; /* Red color like your screenshot */
  color: white;
  padding: 0px 8px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  position: absolute;
  left: 0;
  width: 24px;
  height: 24px;
  line-height: 24px;
}

.selected-option {
  display: inline-block;
  border-radius: var(--radius-md, 8px);
  background: var(--colors-grey-grey-50, #F1F1F1);
  padding: var(--spacing-1, 4px) var(--spacing-2, 8px);
  margin: 0 var(--spacing-1, 4px);
  color: var(--colors-Black-black-500, #010202);
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 16.8px */
}
</style>