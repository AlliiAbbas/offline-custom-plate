<template>
  <article class="d-flex align-items-center p-3 bg-white border rounded shadow-sm mb-2" style="min-height: 70px; width: 220px;">
    <div v-if="!useCircleIcon" class="d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px;">
      <img :src="icon" alt="Statistics icon" class="img-fluid" style="max-width: 40px; max-height: 40px;" />
    </div>
    <div v-else class="d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px;">
      <div class="rounded-circle bg-light border" style="width: 40px; height: 40px;"></div>
    </div>
    <div class="flex-grow-1">
      <p class="text-muted mb-1 small fw-medium">{{ title }}</p>
      <p class="mb-0 fw-bold text-dark">
        <template v-if="typeof value === 'string'">
          {{ value }}
        </template>
        <template v-else>
          {{ value.amount }}
          <span class="fw-normal small text-muted">{{ value.currency }}</span>
        </template>
      </p>
    </div>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Object],
    required: true
  },
  useCircleIcon: {
    type: Boolean,
    default: false
  }
})
</script>
