<template>
  <article class=" ">
    <div class="card-body p-0">
      <header class="card-header bg-white border-bottom rounded-top py-3" style="border-color: #F1F1F1;">
        <h1 class="card-title mb-0  fw-bold fs-4">تأمين علي لوحه جمركيه</h1>
      </header>
      <section class="card-body p-4" v-if="!loading">
        <div class="row g-4">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label fw-medium mb-2">نوع المركبة</label>

              <vSelect
                  v-model="custom_plate"
                  :options="customPlateOptions"
                  label="name_ar"
                  dir="rtl"
                  :reduce="option => option.code"
                  placeholder="ابحث عن لوحة"
                  :class="{ 'is-invalid': validationErrors.custom_plate }"
                  :clearable="false"
                  :clear-on-select="false"
              />

              <div class="invalid-feedback d-block" v-if="validationErrors.custom_plate">
                {{ validationErrors.custom_plate }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <h3 class="h5 mb-3 text-dark fw-bold">التاريخ</h3>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">من</label>
                <div class="input-group border rounded-3" :class="{'border-danger is-invalid': validationErrors.from_date}">
                  <input
                      v-model="from_date"
                      class="form-control border-0"
                      :class="{'is-invalid': validationErrors.from_date}"
                      type="text"
                      placeholder="اختر تاريخ البداية"
                      onfocus="(this.type='date')"
                      onblur="(this.type='text')"
                  />
                </div>
                <div class="invalid-feedback d-block" v-if="validationErrors.from_date">{{ validationErrors.from_date }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label fw-medium mb-2">الي</label>
                <div class="input-group border rounded-3" :class="{'border-danger is-invalid': validationErrors.to_date}">
                  <input
                      v-model="to_date"
                      class="form-control border-0"
                      :class="{'is-invalid': validationErrors.to_date}"
                      type="text"
                      placeholder="اختر تاريخ النهاية"
                      onfocus="(this.type='date')"
                      onblur="(this.type='text')"
                  />
                </div>
                <div class="invalid-feedback d-block" v-if="validationErrors.to_date">{{ validationErrors.to_date }}</div>
              </div>
            </div>
          </div>
        </div>
<!--        <div class="d-flex mt-4">-->
<!--          <BFormCheckbox id="checkbox-4" v-model="valid_from" class="custom-checkbox">-->
<!--          </BFormCheckbox>-->
<!--          <label for="checkbox-3" class="non-selectable mx-2" style="user-select: none;">تطبيق الاسعار الجديده</label>-->
<!--        </div>-->
        <div class="d-flex mt-4">
          <BFormCheckbox id="checkbox-3" @click="$emit('handelAttachments')" v-model="attachments" class="custom-checkbox">
          </BFormCheckbox>
          <label for="checkbox-3" class="non-selectable mx-2" style="user-select: none;">أضافة الملحقاتك</label>
        </div>
      </section>
      <div v-else class="d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const customPlateOptions = computed(()=>{
  return store.getters['Vehicle/vehicleTypeOffline'];
})
console.log(customPlateOptions.value);
const attachments = ref(false)
const valid_from = ref(false)
const emit = defineEmits(['handelAttachments','addNewPrice'])
const custom_plate = ref(null);
const from_date = ref('');
const to_date = ref('');
const validationErrors = ref({});
function getVehicleType () {
  validationErrors.value = {};

  if (!custom_plate.value) {
    validationErrors.value.custom_plate = 'نوع المركبة مطلوب';
  }

  if (!from_date.value) {
    validationErrors.value.from_date = 'تاريخ البداية مطلوب';
  }

  if (!to_date.value) {
    validationErrors.value.to_date = 'تاريخ النهاية مطلوب';
  }

  if (from_date.value && to_date.value) {
    const from = new Date(from_date.value);
    const to = new Date(to_date.value);

    if (to < from) {
      validationErrors.value.to_date = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    const yearDiff = to.getFullYear() - from.getFullYear();
    const monthDiff = to.getMonth() - from.getMonth();
    const dayDiff = to.getDate() - from.getDate();

    const totalYears = yearDiff + (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? -1 : 0);
    const totalMonths = (yearDiff * 12) + monthDiff + (dayDiff < 0 ? -1 : 0);

    // Check if vehicle is agricultural
    const isAgricultural = custom_plate.value === 'جرار زراعي' || custom_plate.value === 'مقطورة زراعية';

    if (isAgricultural && totalMonths < 12) {
      validationErrors.value.to_date = 'المدة يجب أن تكون سنة على الأقل للمركبات الزراعية';
    }

    if (totalYears > 3) {
      validationErrors.value.to_date = 'المدة بين التاريخين يجب ألا تتجاوز 3 سنوات';
    }
  }

  if (Object.keys(validationErrors.value).length > 0) {
    return;
  }

  let data = {
    CustomPlate: custom_plate.value,
    from_date: from_date.value,
    to_date: to_date.value,
  };
  if (valid_from.value) {
    data.valid_from = '07-11-2024';
  }

  return data;
}


defineExpose({
  getVehicleType
});


</script>
<style scoped>
.custom-checkbox :deep(.form-check-input:checked) {
  background-color: #dc3545;
  border-color: #dc3545;
}

.custom-checkbox :deep(.form-check-input:focus) {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>
