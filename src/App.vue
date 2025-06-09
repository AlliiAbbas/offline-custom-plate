<template>
  <component :is="layout"  style="background-color: snow" >
    <router-view />
  </component>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { initDB } from '@/utils/indexedDB'

import Default from './Layout/Default.vue'
import Login from './Layout/Login.vue'
import SyncLoader from './components/SyncLoader.vue'
import { useStore } from 'vuex'

const store = useStore()  
const route = useRoute()
const layout = computed(() => {
  const name = route.meta.layout || 'Default'
  return name === 'Login' ? Login : Default
})

// Initialize IndexedDB when app starts
onMounted(async () => {
  try {
    await initDB();
    console.log('IndexedDB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
  }
  store.dispatch('Vehicle/initializeOfflineData');
});
</script> 