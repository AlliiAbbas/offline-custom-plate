<template>
  <div v-if="isLoading" class="sync-loader-overlay">
    <div class="sync-loader-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">جاري مزامنة البيانات...</p>
    </div>
  </div>
  <div v-if="showSuccess" class="sync-success-overlay">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="alert alert-success" role="alert">
        تم مزامنة البيانات بنجاح
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isLoading = ref(false);
const showSuccess = ref(false);
const isOnline = ref(navigator.onLine);

const syncData = async (newStatus) => {
  if (newStatus) {
    isLoading.value = true;
    showSuccess.value = false;
    try {
      await store.dispatch('Vehicle/syncOfflineData').then(() => {
        isLoading.value = false;
        showSuccess.value = true;
        setTimeout(() => {
          showSuccess.value = false;
        }, 1000);
      });
    } catch (error) {
      console.error('Failed to sync data:', error);
      isLoading.value = false;
    }
  }
}



defineExpose({
  syncData
});

onMounted(() => {

  window.addEventListener('online', () => {
    isOnline.value = true;
  });
  window.addEventListener('offline', () => {
    isOnline.value = false;
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

.sync-success-overlay {
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

.sync-success-content {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.success-icon {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.alert {
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style> 