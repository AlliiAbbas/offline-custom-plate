<template>
  <div class="compulsory-insurance rounded-3 card my-2" style="border-color: #efefef" dir="rtl">
    <div class="card-body p-0">
      <header class="card-header bg-white border-bottom rounded-top py-3" style="border-color: #F1F1F1;">
        <h1 class="card-title mb-0 fw-bold fs-4">تأمين لوحة جمركيه</h1>
      </header>

      <section class="card-body p-4" v-if="!loading">
        <form @submit.prevent="handleSubmit">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">اسم المالك</label>
                <input
                  type="text"
                  v-model="formData.ownerName"
                  @input="filterInput"
                  name="ownerName"
                  data-filter="text"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.ownerName }"
                  placeholder="اسم المالك"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.ownerName">
                  {{ validationErrors.ownerName }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">الرقم القومي</label>
                <input
                  type="text"
                  v-model="formData.nationalId"
                  maxlength="14"
                  @input="filterInput"
                  name="nationalId"
                  data-filter="number"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.nationalId }"
                  placeholder="الرقم القومي"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.nationalId">
                  {{ validationErrors.nationalId }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">جواز السفر</label>
                <input
                    type="text"
                    v-model="formData.passport"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.passport }"
                    placeholder="جواز السفر"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.passport">
                  {{ validationErrors.passport }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">العنوان</label>
                <input
                    type="text"
                    v-model="formData.address"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.address }"
                    placeholder="العنوان"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.address">
                  {{ validationErrors.address }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">الوظيفه</label>
                <input
                    type="text"
                    v-model="formData.job"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.job }"
                    placeholder="الوظيفه"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.job">
                  {{ validationErrors.job }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">رقم التليفون</label>
                <input
                    type="text"
                    v-model="formData.phoneNumber"
                    @input="filterInput"
                    name="phoneNumber"
                    data-filter="number"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.phoneNumber }"
                    placeholder="رقم تليفون المالك"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.phoneNumber">
                  {{ validationErrors.phoneNumber }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">الماركه</label>
                <input
                    type="text"
                    v-model="formData.brand"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.brand }"
                    placeholder="الماركه"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.brand">
                  {{ validationErrors.brand }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">الطراز</label>
                <input
                    type="text"
                    v-model="formData.model"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.model }"
                    placeholder="الطراز"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.model">
                  {{ validationErrors.model }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">سنه الصنع</label>
                <input
                    type="number"
                    step="1"
                    v-model="formData.manufacturingYear"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.manufacturingYear }"
                    placeholder="سنه الصنع"
                    min="1"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.manufacturingYear">
                  {{ validationErrors.manufacturingYear }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">لون المركبة</label>
                <input
                    type="text"
                    v-model="formData.vehicle_color"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.vehicle_color }"
                    placeholder="ادخل لون المركبة"
                    @input="filterInput"
                    name="vehicle_color"
                    data-filter="text"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.vehicle_color">
                  {{ validationErrors.vehicle_color }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">نوع الترخيص</label>
                <v-select
                  :options="optionsTypes"
                  v-model="formData.licenseType"
                  :class="['', { 'is-invalid': validationErrors.licenseType }]"
                  placeholder="نوع الترخيص"
                  dir="rtl"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.licenseType">
                  {{ validationErrors.licenseType }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">رقم اللوحة</label>
                <div class="d-flex gap-2 flex-wrap align-items-center">
                  <input
                      v-for="(char, index) in plateChars.slice(0, 3)"
                      :key="index"
                      v-model="plateChars[index]"
                      type="text"
                      maxlength="1"
                      :placeholder="['ا', 'ب', 'ج'][index]"
                      class="form-control text-danger text-center plate-box"
                      @input="(e) => onPlateInput(index, e)"
                      @keydown.backspace="(e) => onPlateBackspace(index, e)"
                      ref="plateInputs"
                  />
                  <div class="plate-separator mx-1"></div>
                  <input
                      v-for="(char, index) in plateChars.slice(3)"
                      :key="index + 3"
                      v-model="plateChars[index + 3]"
                      type="text"
                      maxlength="1"
                      :placeholder="['1', '2', '3' ,'4'][index]"
                      class="form-control text-danger text-center plate-box"
                      @input="(e) => onPlateInput(index + 3, e)"
                      @keydown.backspace="(e) => onPlateBackspace(index + 3, e)"
                      ref="plateInputs"
                  />
                </div>
                <p class="text-danger" v-if="validationErrors.plateNumber">
                  {{ validationErrors.plateNumber }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">رقم الشاسيه</label>
                <input
                    type="text"
                    v-model="formData.chassisNumber"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.chassisNumber }"
                    placeholder="رقم الشاسيه"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.chassisNumber">
                  {{ validationErrors.chassisNumber }}
                </div>
              </div>
            </div>
            <div class="col-md-6" v-if="!shouldHideEngineFields">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">رقم الموتور</label>
                <input
                    type="text"
                    v-model="formData.engineNumber"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.engineNumber }"
                    placeholder="رقم الموتور"

                />
                <div class="invalid-feedback d-block" v-if="validationErrors.engineNumber">
                  {{ validationErrors.engineNumber }}
                </div>
              </div>
            </div>
            <div class="col-md-6" v-if="!shouldHideEngineFields">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">السلندرات</label>
                <input
                    type="text"
                    v-model="formData.cylinders"
                    @input="filterInput"
                    name="cylinders"
                    data-filter="number"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.cylinders }"
                    placeholder="السلندرات"

                />
                <div class="invalid-feedback d-block" v-if="validationErrors.cylinders">
                  {{ validationErrors.cylinders }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">اخر شركه تامين</label>
                <input
                    type="text"
                    v-model="formData.lastInsuranceCompany"
                    class="form-control"
                    :class="{ 'is-invalid': validationErrors.lastInsuranceCompany }"
                    placeholder="آخر شركة تأمين"
                    @input="filterInput"
                    name="lastInsuranceCompany"
                    data-filter="text"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.lastInsuranceCompany">
                  {{ validationErrors.lastInsuranceCompany }}
                </div>
              </div>
            </div>
          </div>

          <footer class="card-footer bg-white d-flex justify-content-end border-top rounded-bottom py-3 mt-4">
            <button class="btn btn-danger rounded-3 py-2 fw-bold" style="width: 300px;" :disabled="loading" type="submit">
              <span v-if="!loading">التالي</span>
              <div v-else class="spinner-border spinner-border-sm" role="status"></div>
            </button>
          </footer>
        </form>
      </section>

      <div v-else class="d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
const router = useRouter();
const store = useStore();
const loading = ref(false);

const formData = ref({
  ownerName: '',
  nationalId: '',
  passport:'',
  address: '',
  job: '',
  brand: '',
  model: '',
  manufacturingYear: '',
  licenseType: '',
  plateNumber: '       ',
  chassisNumber: '',
  engineNumber: '',
  cylinders: '',
  lastInsuranceCompany: '',
  phoneNumber: '',
  vehicle_color: '',
});
const optionsTypes = ['جمرك ملاكي','جمرك دراجة نارية' ,'جمرك مقطورة' ,'جمرك ملحقة','نقل جمرك','نصف مقطورة جمرك','اتوبيس جمرك']
const plateInputs = ref([]);
const plateChars = ref(['', '', '', '', '', '', '']);

const validationErrors = ref({});

const shouldHideEngineFields = computed(() => {
  const hideTypes = ['جمرك مقطورة', 'جمرك ملحقة', 'نصف مقطورة جمرك'];
  return hideTypes.includes(formData.value.licenseType);
});

function filterInput(event) {
  const inputEl = event.target;
  const filterType = inputEl.dataset.filter;
  const fieldName = inputEl.name;
  let value = inputEl.value;

  if (filterType === 'text') {
    value = value.replace(/[^ء-يa-zA-Z\s]/g, '');
  } else if (filterType === 'number') {
    value = value.replace(/[^0-9]/g, '');
  }

  inputEl.value = value;

  if (fieldName && formData.value.hasOwnProperty(fieldName)) {
    formData.value[fieldName] = value;
  }
}

const formatPlateNumber = (event) => {
  let value = event.target.value.toUpperCase();
  value = value.replace(/[^ء-ي0-9\s-]/g, '');
  value = value.replace(/\s*-\s*/g, ' - ');
  formData.value.plateNumber = value;
};
const onPlateInput = async (index, event) => {
  const value = event.target.value.toUpperCase();
  
  // Handle first 3 positions (Arabic letters)
  if (index < 3) {
    if (/^[\u0600-\u06FF]$/.test(value)) {
      plateChars.value[index] = value;
      // Update formData with non-empty characters only
      const firstPart = plateChars.value.slice(0, 3).filter(char => char !== '').join('');
      const lastPart = plateChars.value.slice(3).filter(char => char !== '').join('');
      formData.value.plateNumber = firstPart + lastPart;
      
      if (index < 2) {
        await nextTick();
        plateInputs.value[index + 1].focus();
      }
    } else {
      event.target.value = plateChars.value[index];
    }
  }
  // Handle last 4 positions (numbers)
  else {
    if (/^\d$/.test(value)) {
      plateChars.value[index] = value;
      // Update formData with non-empty characters only
      const firstPart = plateChars.value.slice(0, 3).filter(char => char !== '').join('');
      const lastPart = plateChars.value.slice(3).filter(char => char !== '').join('');
      formData.value.plateNumber = firstPart + lastPart;
      
      if (index < 6) {
        await nextTick();
        plateInputs.value[index + 1].focus();
      }
    } else {
      event.target.value = plateChars.value[index];
    }
  }
};

const onPlateBackspace = async (index, event) => {
  if (event.key === 'Backspace') {
    plateChars.value[index] = '';
    // Update formData with non-empty characters only
    const firstPart = plateChars.value.slice(0, 3).filter(char => char !== '').join('');
    const lastPart = plateChars.value.slice(3).filter(char => char !== '').join('');
    formData.value.plateNumber = firstPart + lastPart;
    
    if (index > 0) {
      await nextTick();
      plateInputs.value[index - 1].focus();
    }
  }
};
const validateForm = () => {
  validationErrors.value = {};
  let isValid = true;

  if (!formData.value.ownerName.trim()) {
    validationErrors.value.ownerName = 'اسم المالك مطلوب';
    isValid = false;
  } else {
    validationErrors.value.ownerName = '';
  } if (!formData.value.vehicle_color.trim()) {
    validationErrors.value.vehicle_color = 'لون المركبه مطلوب';
    isValid = false;
  } else if(/^\d+$/.test(formData.value.vehicle_color)){
    validationErrors.value.vehicle_color = 'لون المركبة يجب أن يكون حروف فقط';
  }

  // Check if either national ID or passport is provided
  if (!formData.value.nationalId.trim() && !formData.value.passport.trim()) {
    validationErrors.value.nationalId = 'الرقم القومي أو جواز السفر مطلوب';
    validationErrors.value.passport = 'الرقم القومي أو جواز السفر مطلوب';
    isValid = false;
  } else {
    // If national ID is provided, validate its format
    if (formData.value.nationalId.trim()) {
      if (/^\d+$/.test(formData.value.nationalId)) {
        if (formData.value.nationalId.length !== 14) {
          validationErrors.value.nationalId = 'الرقم القومي يجب أن يكون 14 رقم';
          isValid = false;
        } else {
          validationErrors.value.nationalId = '';
        }
      } else {
        validationErrors.value.nationalId = 'الرقم القومي يجب أن يكون أرقام فقط';
        isValid = false;
      }
    } else {
      validationErrors.value.nationalId = '';
    }
    // Clear passport validation error if either field is provided
    validationErrors.value.passport = '';
  }

  if (!formData.value.phoneNumber.trim()) {
    validationErrors.value.phoneNumber = 'رقم التليفون مطلوب';
    isValid = false;
  } else if (!/^(010|011|012|015)\d{8}$/.test(formData.value.phoneNumber)) {
    validationErrors.value.phoneNumber = 'ادخل رقم تليفون صالح';
    isValid = false;
  }
  if (!formData.value.address.trim()) {
    validationErrors.value.address = 'العنوان مطلوب';
    isValid = false;
  }
  if (!formData.value.job.trim()) {
    validationErrors.value.job = 'الوظيفة مطلوبة';
    isValid = false;
  }
  if (!formData.value.brand.trim()) {
    validationErrors.value.brand = 'الماركة مطلوبة';
    isValid = false;
  }
  if (!formData.value.model.trim()) {
    validationErrors.value.model = 'الطراز مطلوب';
    isValid = false;
  }
  if (!formData.value.manufacturingYear) {
    validationErrors.value.manufacturingYear = 'سنة الصنع مطلوبة';
    isValid = false;
  } else {
    const year = parseInt(formData.value.manufacturingYear);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      validationErrors.value.manufacturingYear = 'سنة الصنع غير صحيحة';
      isValid = false;
    }
  }
  if (!formData.value.licenseType) {
    validationErrors.value.licenseType = 'نوع الترخيص مطلوب';
    isValid = false;
  } else {
    validationErrors.value.licenseType = '';
  }

  if (!formData.value.chassisNumber.trim()) {
    validationErrors.value.chassisNumber = 'رقم الشاسيه مطلوب';
    isValid = false;
  }
  
  // Only validate engine fields if they should be visible
  if (!shouldHideEngineFields.value) {
    if (!formData.value.engineNumber.trim()) {
      validationErrors.value.engineNumber = 'رقم الموتور مطلوب';
      isValid = false;
    }
    if (!formData.value.cylinders.trim()) {
      validationErrors.value.cylinders = 'السلندرات مطلوبة';
      isValid = false;
    } else if (!/^\d+$/.test(formData.value.cylinders)) {
      validationErrors.value.cylinders = 'السلندرات يجب أن تكون أرقام فقط';
      isValid = false;
    }
  }
  
  if (!formData.value.lastInsuranceCompany.trim()) {
    validationErrors.value.lastInsuranceCompany = 'آخر شركة تأمين مطلوبة';
    isValid = false;
  }
  if(plateChars.value.join("") !== ''){
    // Plate number validation
    const firstPart = plateChars.value.slice(0, 3).filter(char => char !== '').join('');
    const lastPart = plateChars.value.slice(3).filter(char => char !== '').join('');

    // Check first part (2-3 Arabic letters)
    if (!/^[\u0600-\u06FF]{2,3}$/.test(firstPart)) {
      validationErrors.value.plateNumber = 'يجب إدخال حرفين أو ثلاثة حروف عربية في البداية';
      isValid = false;
    }

    // Check last part (3-4 numbers)
    if (!/^\d{3,4}$/.test(lastPart)) {
      validationErrors.value.plateNumber = 'يجب إدخال ثلاثة أو أربعة أرقام في النهاية';
      isValid = false;
    }
  }


  return isValid;
};

const handleSubmit = async () => {
  if (validateForm()) {
    loading.value = true
    try {
      await store.dispatch('Vehicle/setUserData', formData.value)
      router.push('./customs-plate-insurance-offline')
    } catch (error) {
      console.error('خطأ أثناء التخزين في localStorage:', error)
    } finally {
      loading.value = false
    }
  }
}

</script>

<style scoped>
.plate-box {
  width: 40px;
  height: 40px;
  text-transform: uppercase;
  font-size: 1.25rem;
  padding: 0;
  text-align: center;
}

.plate-separator {
  width: 2px;
  height: 40px;
  background-color: #000;
  border-radius: 2px;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

/* v-select styling */
:deep(.v-select) {
  width: 100%;
}

:deep(.v-select .vs__dropdown-toggle) {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #fff;
  min-height: 38px;
}

:deep(.v-select .vs__dropdown-toggle:focus-within) {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

:deep(.v-select.is-invalid .vs__dropdown-toggle) {
  border-color: #dc3545;
}

:deep(.v-select .vs__selected-options) {
  padding: 0;
}

:deep(.v-select .vs__actions) {
  padding: 0;
}

:deep(.v-select .vs__search) {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
}

:deep(.v-select .vs__dropdown-menu) {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

:deep(.v-select .vs__dropdown-option) {
  padding: 0.5rem 0.75rem;
}

:deep(.v-select .vs__dropdown-option--highlight) {
  background-color: #dc3545;
  color: white;
}
</style>