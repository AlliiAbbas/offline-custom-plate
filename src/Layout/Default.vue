<template>
  <div class="d-flex gap-3">
    <div class="d-flex flex-column w-100">
      <HorizontalNavbar />
      <RouterView />
    </div>
    <VerticalNavbar/>
    <SyncLoader />

  </div>
</template>

<script setup>
import VerticalNavbar from '../components/auth/Layouts/VerticalNavbar.vue'
import HorizontalNavbar from '../components/auth/Layouts/HorizontalNavbar.vue'
import SyncLoader from "@/components/SyncLoader.vue";
</script>