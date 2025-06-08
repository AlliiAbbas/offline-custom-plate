<template>
  <article class="popup-container">
    <DocumentHeader @closePopup="$emit('closePopup')"/>
    <main class="popup-content">

      <div class="details-container overflow-y-auto">
        <CustomsPlatCalc :payload="props?.payload" />
        <PricingDetails :extensionsData="extensionsData" v-if="extensionsData?.length !== 0" />
      </div>
      <Total :payload="props?.payload" />
    </main>
    <ActionButton @closePopup="$emit('closePopup')" />
  </article>
</template>

<script setup>
import DocumentHeader from "@/components/CustomsPlate/Calc/DocumentHeader.vue";
import CustomsPlatCalc from "./CustomsPlateCacl.vue";
import Total from "./Total.vue";
import ActionButton from "@/components/CustomsPlate/Calc/ActionButton.vue";
import PricingDetails from "@/components/CustomsPlate/Calc/PricingDetails.vue";
const props = defineProps(['payload','extensionsData'])
</script>

<style scoped>
.popup-container {
  justify-content: center;
  align-items: stretch;
  border-radius: 8px;
  background-color: #fcfcfd;
  position: relative;
  display: flex;
  flex-direction: column;
}

.popup-content {
  z-index: 0;
  margin-top: 18px;
  width: 100%;
  font-family: 'Noto Sans Arabic', sans-serif;
}

.details-container {
  height: 650px;
  width: 100%;
  overflow: hidden;
}

@media (max-width: 991px) {
  .popup-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .popup-content,
  .details-container {
    max-width: 100%;
  }
}
</style>
