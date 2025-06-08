<template>
  <section class="container bg-white rounded shadow-sm py-4 px-4 mb-3">
    <div class="row g-4 align-items-end">
      <div class="col-md-3">
        <label for="start-date" class="form-label fw-medium">From</label>
        <Calendar
            id="start-date"
            v-model="startDate"
            placeholder="Select start date"
            class="form-control"
        />
      </div>
      <div class="col-md-3">
        <label for="end-date" class="form-label fw-medium">To</label>
        <Calendar
            id="end-date"
            v-model="endDate"
            placeholder="Select end date"
            class="form-control"
        />
      </div>
      <div class="col-md-2 d-grid">
        <button class="btn btn-danger d-flex align-items-center justify-content-center gap-2" @click="exportData">
          <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1713487bcb93ba9b0de3bc87e57a011c5b0f9301?placeholderIfAbsent=true&apiKey=d36c137a2e704300b9d6d34d43f459c9"
              alt="Export icon"
              style="width: 20px; height: 20px;"
          />
          <span>Export All</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const startDate = ref(null)
const endDate = ref(null)

function exportData() {
  console.log('Exporting data between', startDate.value, 'and', endDate.value)
}
</script>
