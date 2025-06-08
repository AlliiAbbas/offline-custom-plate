<template>
  <section class="vehicle-details">
    <h2 class="section-title">بيانات المركبة</h2>
    <div class="details-panel">
      <div class="details-list">
        <div class="detail-item">
          <span class="amount">{{ formatEGP(payload?.base_price) }}</span>
          <span class="label">صافي القسط</span>
        </div>
        <div v-if="payload?.taxes" v-for="([key, value], index) in Object?.entries(payload?.taxes)" :key="index" class="detail-item">
          <span class="amount">{{ formatEGP(value) }}</span>
          <div class="label-group">
            <span class="label">{{ taxLabels[key] }}</span>
          </div>
        </div>

        <div class="detail-item">
          <span class="amount">{{ formatEGP(payload?.issue_fees) }}</span>
          <span class="label">مصاريف الاصدار</span>
        </div>
        <div class="detail-item">
          <span class="amount">{{ formatEGP(payload?.taxes.total+payload?.issue_fees) }}</span>
          <span class="label">اجمالي الضرائب</span>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { formatEGP } from '@/utils/formatters';

const props = defineProps(['payload'])
const taxLabels = {
  stamp_tax: 'نصف دمغه نسبيه',
  supervision_tax: 'رسم الاشراف والرقابه',
  review_tax: 'رسم الاعتماد والمراجعه',
  fixed_tax: 'ضريبه نوعيه',
  total: 'اجمالي الضرائب (قبل مصاريف الاصدار)',
}
</script>
<style scoped>
.vehicle-details {
  display: flex;
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
  gap: 100px;
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
