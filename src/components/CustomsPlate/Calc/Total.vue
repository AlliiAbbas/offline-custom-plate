<template>
  <section class="total-section">
    <div class="amount-container">
      <div class="amount-details">
        <span class="currency-text"> جنيه</span>
        <span class="total-amount">{{ formatEGP(payload?.final_total + payload?.extensions_total) }}</span>
      </div>
      <div class="label-container">
        <div class="currency-label">
          <span>(</span>
          <span>جنيه مصري</span>
          <span>)</span>
        </div>
        <span class="total-label">الاجمالي</span>
      </div>
    </div>
  </section>
</template>
<script setup>
import { formatEGP } from '@/utils/formatters';

const props = defineProps(['payload'])
</script>
<style scoped>
.total-section {
  margin-top: 20px;
  width: 100%;
}

.amount-container {
  border-radius: 4px;
  background-color: rgba(242, 245, 249, 1);
  border: 1px solid rgba(224, 224, 224, 1);
  display: flex;
  min-height: 57px;
  width: 100%;
  padding: 0 28px;
  align-items: center;
  gap: 100px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.amount-details {
  align-self: stretch;
  display: flex;
  margin: auto 0;
  align-items: end;
  gap: 2px;
}

.currency-text {
  color: #747474;
  text-align: right;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
  width: 54px;
}

.total-amount {
  color: #010202;
  font-size: 24px;
  font-weight: 500;
}

.label-container {
  align-self: stretch;
  display: flex;
  margin: auto 0;
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
  font-weight: 400;
}

.currency-label span:nth-child(2) {
  font-size: 16px;
  line-height: 1.2;
}

.total-label {
  color: #010202;
  font-weight: 600;
}

@media (max-width: 991px) {
  .amount-container {
    max-width: 100%;
    padding: 20px;
  }
}
</style>
