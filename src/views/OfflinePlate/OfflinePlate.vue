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
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.nationalId }"
                  placeholder="الرقم القومي"
                  maxlength="14"
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
                <label class="form-label fw-medium mb-2">نوع الترخيص</label>
                <input
                  type="text"
                  v-model="formData.licenseType"
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
                <label class="form-label fw-medium mb-2">رقم اللوحه</label>
                <input
                  type="text"
                  v-model="formData.plateNumber"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.plateNumber }"
                  placeholder="رقم اللوحه"
                />
                <div class="invalid-feedback d-block" v-if="validationErrors.plateNumber">
                  {{ validationErrors.plateNumber }}
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
import { ref, onMounted } from 'vue';
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
  plateNumber: '',
  chassisNumber: '',
  engineNumber: '',
  cylinders: '',
  lastInsuranceCompany: ''
});


const validationErrors = ref({});

const validateForm = () => {
  validationErrors.value = {};
  let isValid = true;

  if (!formData.value.ownerName.trim()) {
    validationErrors.value.ownerName = 'اسم المالك مطلوب';
    isValid = false;
  }
  if (!formData.value.nationalId.trim()) {
    validationErrors.value.nationalId = 'الرقم القومي مطلوب';
    isValid = false;
  } else if (!/^\d{14}$/.test(formData.value.nationalId)) {
    validationErrors.value.nationalId = 'الرقم القومي يجب أن يكون 14 رقم';
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
  if (!formData.value.plateNumber.trim()) {
    validationErrors.value.plateNumber = 'رقم اللوحة مطلوب';
    isValid = false;
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
.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>