<template>
  <nav
      class="d-flex flex-wrap align-items-start p-2 my-auto bg-white rounded shadow-sm border border-secondary"
      style="min-width: 240px; max-width: 100%; width: 493px;"
  >
    <button
        type="button"
        class="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded fw-semibold transition"
        :class="activeTab === 'online'
        ? 'text-danger bg-light shadow border-bottom border-4 border-danger'
        : 'text-secondary bg-white hover-bg-light'"
        aria-selected="activeTab === 'online'"
        @click="selectTab('online')"
    >
      <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/298bdce6009f6764157b32b4d7f7c83d457a89e9?placeholderIfAbsent=true&apiKey=d36c137a2e704300b9d6d34d43f459c9"
          alt="Online Reports Icon"
          class="img-fluid"
          style="width: 20px; height: 20px; object-fit: contain;"
      />
      <span class="pe-1">Online Reports</span>
    </button>

    <button
        type="button"
        class="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded fw-semibold transition"
        :class="activeTab === 'offline'
        ? 'text-danger bg-light shadow border-bottom border-4 border-danger'
        : 'text-secondary bg-white hover-bg-light'"
        aria-selected="activeTab === 'offline'"
        @click="selectTab('offline')"
    >
      <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9603edc30590a8443113fe395f7f3c769e7c8542?placeholderIfAbsent=true&apiKey=d36c137a2e704300b9d6d34d43f459c9"
          alt="Offline Reports Icon"
          class="img-fluid"
          style="width: 20px; height: 20px; object-fit: contain;"
      />
      <span class="pe-1">Offline Reports</span>
    </button>
  </nav>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const activeTab = ref('online')
const emit = defineEmits(['tab-changed'])

function selectTab(tab) {
  activeTab.value = tab
  emit('tab-changed', tab)
}
</script>

<style scoped>
.hover-bg-light:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}
.transition {
  transition: all 0.2s ease-in-out;
}
.gap-2 {
  gap: 0.5rem;
}
</style>
