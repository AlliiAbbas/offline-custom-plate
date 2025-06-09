<template>
  <section class="pricing-details">
    <h2 class="section-title">بيانات الملاحق</h2>
    <div class="details-panel">
      <div class="details-list">
        <div v-for="i in props?.extensionsData" class="detail-item d-flex flex-column">
          <div v-if="Array.isArray(i)" v-for="e in i" class="w-full d-flex flex-column w-100 justify-content-between">
            <div class="w-full d-flex w-100 justify-content-between"><span
                class="amount"></span> <span class="label" style="font-weight: bold">{{e?.name}}</span>
            </div>
            <div class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ e?.details?.range }}</span> <span class="label">المدة</span>
            </div>

            <div class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(e?.details?.taxes?.fixed_tax) }}</span> <span class="label">ضريبه نوعيه</span></div>
            <div v-if="i.amount !== 8" class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(e?.details?.raw_amount) }}</span> <span class="label">القسط الصافي</span></div>
            <div  class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(e?.details?.taxes?.issue_fees) }}</span> <span class="label">مصاريف الاصدار</span></div>
            <div v-if="i.amount !== 8" class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(e?.details?.taxes?.rounding) }}</span> <span class="label">فرق التقريب</span></div>
            <div class="w-full d-flex w-100 justify-content-between">
              <span class="amount">{{ formatEGP(e?.amount) }}</span>
              <span class="label">اجمالي المستحق علي الملحق</span>
            </div>
            <div v-if="i.amount !== 8" class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(e?.details?.taxes?.TotalTax) }}</span> <span class="label">اجمالي الضرائب</span>
            </div>
          </div>
          <div v-else class="w-full d-flex flex-column w-100 justify-content-between">
            <div class="w-full d-flex w-100 justify-content-between"><span
                class="amount"></span> <span class="label" style="font-weight: bold">{{i?.name}}</span>
            </div>



            <div class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(i?.details?.taxes?.fixed_tax) }}</span> <span class="label">ضريبه نوعيه</span></div>
            <div v-if="i.amount !== 8" class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(i?.details?.raw_amount) }}</span> <span class="label">القسط الصافي</span></div>
            <div  class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(i?.details?.taxes?.issue_fees) }}</span> <span class="label">مصاريف الاصدار</span></div>
            <div v-if="i.amount !== 8" class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(i?.details?.taxes?.rounding) }}</span> <span class="label">فرق التقريب</span></div>
            <div class="w-full d-flex w-100 justify-content-between">
              <span class="amount">{{ formatEGP(i?.amount) }}</span>
              <span class="label">اجمالي المستحق علي الملحق</span>
            </div>
            <div v-if="i.amount !== 8" class="w-full d-flex w-100 justify-content-between"><span
                class="amount">{{ formatEGP(i?.details?.taxes?.TotalTax) }}</span> <span class="label">اجمالي الضرائب</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { formatEGP } from '@/utils/formatters';

const props = defineProps(['extensionsData'])
</script>
<style scoped>
.pricing-details {
  display: flex;
  margin-top: 20px;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
}

.section-title {
  align-self: end;
  width: 214px;
  max-width: 100%;
  padding: 0 10px;
  font-size: 16px;
  color: #555;
  font-weight: 600;
  text-align: right;
  line-height: 1.2;
}

.details-panel {
  border-radius: 4px;
  background-color: rgba(242, 245, 249, 1);
  border: 1px solid rgba(224, 224, 224, 1);
  display: flex;
  margin-top: 8px;
  width: 100%;
  padding: 20px 28px;
  align-items: start;
  font-weight: 400;
  justify-content: space-between;
}

.details-list {
  min-width: 240px;
  width: 100%;
  flex: 1;
}

.detail-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.amount {
  width: 91px;
  align-self: stretch;
  margin: auto 0;
  font-size: 16px;
  color: #747474;
  white-space: nowrap;
}

.label {
  font-size: 14px;
  color: #010202;
  text-align: right;
}

.label-group {
  display: flex;
  align-items: start;
  gap: 6px;
  font-size: 14px;
  text-align: right;
}

.currency-label {
  display: flex;
  align-items: center;
  gap: 1px;
  color: #747474;
}

@media (max-width: 991px) {
  .section-title {
    padding-left: 20px;
  }

  .details-panel {
    padding: 20px;
    max-width: 100%;
  }

  .details-list {
    max-width: 100%;
  }

  .amount {
    white-space: initial;
  }
}
</style>
