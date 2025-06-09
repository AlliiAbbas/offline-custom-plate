<template>
  <div v-if="isLoading" class="sync-loader-overlay">
    <div class="sync-loader-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">جاري مزامنة البيانات...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isLoading = ref(false);
const isOnline = ref(navigator.onLine);

// Watch for online status changes
watch(isOnline, async (newStatus) => {
  if (newStatus) {
    isLoading.value = true;
    try {
      console.log('asdasd');
      await store.dispatch('Vehicle/syncOfflineData');
      console.log('Data synchronized successfully');
    } catch (error) {
      console.error('Failed to sync data:', error);
    } finally {
      isLoading.value = false;
    }
  }
});

// Add event listeners for online/offline status
onMounted(() => {
  console.log('asdasd');

  window.addEventListener('online', () => {
    isOnline.value = true;
    console.log('asdasd');

  });
  window.addEventListener('offline', () => {
    isOnline.value = false;
    console.log('يسي');

  });
});
</script>

<style scoped>
.sync-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.sync-loader-content {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style> 