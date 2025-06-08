<template>
  <section class="bg-white shadow-sm py-5">
    <div class="container px-3 px-md-5">
          <header>
            <h1 class="text-center fw-medium fs-4 text-dark mb-5">
              اي نوع وثيقه تأمين تريد اصدارها
            </h1>
            <div class="row g-2">
              <div class="w-100 px-4 text-end">
                <div class="d-flex align-items-center  mb-3" v-if="!isOnline">
                  <div class="network-status-indicator" :class="{ 'offline': !isOnline }"></div>

                  <span class="me-2" :class="isOnline ? 'text-success' : 'text-danger'">
                    {{ isOnline ? 'متصل بالإنترنت' : 'غير متصل بالإنترنت' }}
                  </span>
                </div>
              </div>
              <div
                  class="col-12 col-sm-4 col-lg-4 col-xl-4"
                  v-for="(option, index) in isOnline ? insuranceOptions : insuranceOptionsOffline"
                  :key="index"
              >
                <DocumentsOptions
                    :image-src="option.imageSrc"
                    :alt-text="option.altText"
                    :title="option.title"
                    @click="goService(option.name)"
                />
              </div>
            </div>
          </header>
    </div>
  </section>
</template>


<script setup>
import DocumentsOptions from '../components/auth/Doc/DocumentsOptions.vue'
import img from '../assets/images/Icon.png'
import img2 from '../assets/images/Icon4.png'
import img4 from '../assets/images/Icon2.png'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

// Watch for network status changes
watch(isOnline, (newStatus) => {
  if (!newStatus) {
    console.log('You are offline - using offline mode')
  } else {
    console.log('You are online - using online mode')
  }
})

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

const insuranceOptions = ref([
  {
    imageSrc: img2,
    altText: 'Custom plate icon',
    title: 'لوحه جمركيه',
    name: 'OfflinePlate'
  },
])
const insuranceOptionsOffline = ref([
  {
    imageSrc: img2,
    altText: 'Custom plate icon',
    title: 'لوحه جمركيه',
    name: 'OfflinePlate'
  },
])
const goService = (name) => {
  router.push({ name: name })
}
</script>

<style scoped>
section {
  direction: rtl;
}

.fs-4 {
  font-size: 1.5rem !important;
}

@media (max-width: 768px) {
  .fs-4 {
    font-size: 1.2rem !important;
  }
}

:deep(.hover-card) {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

:deep(.hover-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
.network-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #28a745;
  transition: background-color 0.3s ease;
}

.network-status-indicator.offline {
  background-color: #dc3545;
}
</style>
