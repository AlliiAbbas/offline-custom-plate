<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isOpen = ref(true)
const isCollapsed = ref(false)

const isCurrentRoute = (path) => {
  return route.path === path
}

const closeSidebar = () => {
  isOpen.value = false
  isCollapsed.value = true
}

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  isCollapsed.value = !isOpen.value
}

function goHome() {
  router.push({ name: 'Home' });
}
</script>

<template>
  <div>

    <transition name="slide-mini-left">
      <div
          v-if="isCollapsed"
          class="sidebar-mini bg-white h-100 shadow-sm d-flex flex-column align-items-center pt-4"
          @click="toggleSidebar"
      >
        <div class="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2zm18 5H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zm0 7H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2z"/>
          </svg>
        </div>
      </div>
    </transition>


    <transition name="slide-full-left">
      <div v-if="isOpen"
           class="sidebar bg-white position-sticky top-0 vh-100 min-vh-100 shadow-sm d-flex flex-column align-items-center position-relative py-4">

        <div class="position-absolute top-0 end-0 p-3">
          <img src="../../../assets/images/close.png"
               @click="closeSidebar"
               alt="close"
               class="cursor-pointer"
               style="width: 12px; height: 12px;" />
        </div>


        <div class="mb-4">
          <img src="../../../assets/logo1.png" alt="Logo" class="img-fluid"/>
        </div>


        <div @click="router.push('/')" style="cursor: pointer" 
             :class="['document-button rounded-3 d-flex align-items-center gap-2 px-4 py-2 mt-4', 
                     isCurrentRoute('/') ? 'bg-danger' : 'bg-light']">
          <div>
            <img src="../../../assets/images/3.png" alt="document" class="document-icon"/>
          </div>
          <span :class="['fw-medium', isCurrentRoute('/') ? 'text-white' : 'text-dark']">اصدار الوثائق</span>
        </div>
        <div @click="router.push('/table')" style="cursor: pointer" 
             :class="['document-button rounded-3 d-flex align-items-center gap-2 px-4 py-2 mt-4',
                     isCurrentRoute('/table') ? 'bg-danger' : 'bg-light']">
          <div>
            <img src="../../../assets/images/3.png" alt="document" class="document-icon"/>
          </div>
          <span :class="['fw-medium', isCurrentRoute('/table') ? 'text-white' : 'text-dark']">جدول التأمين</span>
        </div>


        <div class="position-absolute bottom-0  text-center" style="margin-bottom: 80px;">
          <div class="d-flex align-items-center">
            <p class="text-muted mb-2 small fw-medium">عن طريق</p>
            <img src="@/assets/logo%20SVG%202.svg"
                 alt=""
                 class="img-fluid"
                 style="width: 100px;" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>

.sidebar {
  width: 240px;
  height: 910px;
}

.sidebar-mini {
  width: 40px;
  height: 910px;
}


.cursor-pointer {
  cursor: pointer;
}


.document-button {
  width: 216px;
}

.document-icon {
  width: 20px;
  height: 20px;
}


.slide-full-left-enter-active,
.slide-mini-left-enter-active,
.slide-mini-left-leave-active {
  transition: all 0.3s ease;
}

.slide-full-left-enter-from,
.slide-mini-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-full-left-enter-to,
.slide-mini-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-full-left-leave-from,
.slide-mini-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-full-left-leave-to,
.slide-mini-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.shadow-lg {
  box-shadow: 10px 0px 16px 0px rgba(103, 85, 164, 0.1) !important;
}


.sidebar, .sidebar-mini {
  direction: rtl;
}


@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  .document-button {
    width: 180px;
  }
}

@media (max-width: 576px) {
  .document-button {
    width: 160px;
  }
}
</style>