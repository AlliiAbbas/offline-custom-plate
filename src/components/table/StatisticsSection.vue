<template>
  <section class="d-flex flex-wrap justify-content-end align-items-center gap-3 w-100 my-auto" style="min-width: 240px;">
    <StatisticsCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/b822e8edbab02489b221fa350f0b27006ef521d5?placeholderIfAbsent=true&apiKey=d36c137a2e704300b9d6d34d43f459c9"
        title="No. of Policies"
        value="6,046,465"
        class="mb-2"
    />
    <StatisticsCard
        :useCircleIcon="true"
        title="Money Amount"
        :value="moneyValue"
        class="mb-2"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StatisticsCard from './StatisticsCard.vue'

const moneyValue = computed(() => ({
  amount: '6,046,465',
  currency: 'EGP'
}))
</script>

<style scoped>
.gap-3 {
  gap: 1rem !important;
}
</style>
