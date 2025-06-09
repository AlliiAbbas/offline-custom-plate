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
                  @input="filterTextOnly"
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
                <label class="form-label fw-medium mb-2">الرقم القومي /  جواز السفر</label>
                <input
                  type="text"
                  v-model="formData.nationalId"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.nationalId }"
                  placeholder="الرقم القومي /  جواز السفر"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.nationalId">
                  {{ validationErrors.nationalId }}
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
                    @input="filterNumbersOnly"
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
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.vehicle_color">
                  {{ validationErrors.vehicle_color }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">نوع الترخيص</label>
                <input
                  type="text"
                  v-model="formData.licenseType"
                  @input="filterTextOnly"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.licenseType }"
                  placeholder="نوع الترخيص"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.licenseType">
                  {{ validationErrors.licenseType }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">رقم اللوحة</label>
                <div class="d-flex gap-2 flex-wrap">
                  <input
                      v-for="(char, index) in formData.plateNumber"
                      :key="index"
                      v-model="formData.plateNumber[index]"
                      type="text"
                      maxlength="1"
                      class="form-control text-center plate-box"
                      :class="validationErrors.plateNumber ? 'is-invalid border-danger' : ''"
                      @input="(e) => onPlateInput(index, e)"
                      @keydown.backspace="(e) => onPlateBackspace(index, e)"
                      ref="plateInputs"
                  />
                </div>
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
            <div class="col-md-6">
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
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">السلندرات</label>
                <input
                    type="text"
                    v-model="formData.cylinders"
                    @input="filterNumbersOnly"
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
                    @input="filterTextOnly"
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
import { ref, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();
const loading = ref(false);

const formData = ref({
  ownerName: '',
  nationalId: '',
  address: '',
  job: '',
  brand: '',
  model: '',
  manufacturingYear: '',
  licenseType: '',
  plateNumber:  Array(7).fill(''),
  chassisNumber: '',
  engineNumber: '',
  cylinders: '',
  lastInsuranceCompany: '',
  phoneNumber: '',
  vehicle_color: '',
});
const plateInputs = ref([]);

const validationErrors = ref({});

function filterTextOnly(event) {
  const input = event.target.value
  const filtered = input.replace(/[^ء-يa-zA-Z\s]/g, '')
  event.target.value = filtered
  formData.ownerName = filtered
}
function filterNumbersOnly(event) {
  const input = event.target.value
  const filtered = input.replace(/[^0-9]/g, '')
  event.target.value = filtered
  formData.phoneNumber = filtered
}

const onPlateInput = async (index, event) => {
  const value = event.target.value.toUpperCase();

  if (/^[\u0600-\u06FFA-Z0-9]$/.test(value)) {
    formData.value.plateNumber[index] = value;

    await nextTick();
    if (index < plateInputs.value.length - 1) {
      plateInputs.value[index + 1].focus();
    }
  } else {
    formData.value.plateNumber[index] = '';
  }
};

const onPlateBackspace = async (index, event) => {
  if (!formData.value.plateNumber[index] && index > 0) {
    await nextTick();
    plateInputs.value[index - 1].focus();
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
  if (!formData.value.nationalId.trim()) {
    validationErrors.value.nationalId = 'الرقم القومي / جواز السفر  مطلوب';
    isValid = false;
  } else  {
    validationErrors.value.nationalId = '';
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
  if (!formData.value.licenseType.trim()) {
    validationErrors.value.licenseType = 'نوع الترخيص مطلوب';
    isValid = false;
  }
  const filledPlateChars = formData.value.plateNumber.filter(char => char.trim() !== '');
  if (filledPlateChars.length < 5) {
    validationErrors.value.plateNumber = 'يرجى إدخال 5 خانات على الأقل من رقم اللوحة';
    isValid = false;
  } else {
    validationErrors.value.plateNumber = '';
  }
  if (!formData.value.chassisNumber.trim()) {
    validationErrors.value.chassisNumber = 'رقم الشاسيه مطلوب';
    isValid = false;
  }
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
  if (!formData.value.lastInsuranceCompany.trim()) {
    validationErrors.value.lastInsuranceCompany = 'آخر شركة تأمين مطلوبة';
    isValid = false;
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
.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>