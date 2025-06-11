<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const isOnline = ref(navigator.onLine)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

const handleOnline = () => {
  isOnline.value = true
}

const handleOffline = () => {
  isOnline.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

const logOut = () => {
  sessionStorage.removeItem('token')
  router.push('/login')
}
const username = sessionStorage.getItem('username')

</script>

<template>
  <nav class="navbar position-sticky top-0 z-0 navbar-expand-lg bg-white shadow-sm p-3 mb-3">
    <div class="container-fluid">
      <div class="navbar-brand fw-medium fs-4">اصدار الوثائق</div>

      <div class="d-flex align-items-center gap-3">
        <div class="connection-status" :class="{ 'online': isOnline, 'offline': !isOnline }">
          <div class="status-line"></div>
          <span class="status-text">{{ isOnline ? 'في وضع الاتصال' : 'في وضع عدم الاتصال' }}</span>
        </div>

        <div class="d-flex align-items-center gap-3 position-relative" @click.stop="toggleDropdown" ref="dropdownRef">
          <div class="rounded-circle bg-danger d-flex align-items-center cursor-pointer justify-content-center"
               style="width: 40px; height: 40px;">
            <span v-if="username" class="text-white">{{ username.charAt(0) }}</span>
          </div>

          <div class="text-end cursor-pointer">
            <div class="fw-normal">{{ username }}</div>
            <small class="text-muted">الادمن</small>
          </div>

          <div class="cursor-pointer pb-4">
            <img src="@/assets/images/chevron.png" alt="logo" style="width: 10px;" />
          </div>

          <div v-if="dropdownOpen"
               class="position-absolute start-0 mt-2 bg-white border rounded shadow-sm"
               style="width: 160px; z-index: 1000; top:37px">
            <ul class="list-unstyled mb-0">
              <li>
                <button class="dropdown-item py-2 w-100 text-end"
              @click="logOut">
        تسجيل الخروج</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}

.navbar {
  direction: rtl;
  z-index: 1000;
}

.dropdown-item {
  transition: background-color 0.2s ease;
}

@media (max-width: 576px) {
  .fw-normal {
    font-size: 0.875rem;
  }
  .text-muted {
    font-size: 0.75rem;
  }
}

.shadow-lg {
  box-shadow: 0px 10px 16px 0px rgba(103, 85, 164, 0.1) !important;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
}

.status-line {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.online .status-line {
  background-color: #28a745;
}

.offline .status-line {
  background-color: #dc3545;
}

.status-text {
  font-size: 0.875rem;
}

.online .status-text {
  color: #28a745;
}

.offline .status-text {
  color: #dc3545;
}
</style>
