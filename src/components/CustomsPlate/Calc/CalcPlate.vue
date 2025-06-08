<template>
  <BOffcanvas class="offCanvas" no-close-on-backdrop v-model="props.openModal" no-header-close placement="end" style="width: 650px">
    <div class="w-100 ">
      <calc-popp :payload="props?.payload"  :extensionsData="extensionsData" @closePopup="$emit('closePopup')"/>
    </div>
  </BOffcanvas>
</template>

<script setup>
import CalcPopp from "@/components/CustomsPlate/Calc/CalcPopp.vue";

const props = defineProps(['openModal' , 'payload' , 'extensionsData'])
</script>

<style >
.offCanvas .offcanvas-header{
  display: none !important;
}
</style>