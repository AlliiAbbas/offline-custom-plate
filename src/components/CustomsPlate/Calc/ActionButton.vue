<template>
  <footer class="footer-container">
    <button class="action-button" @click="$emit('closePopup')">تم</button>
  </footer>
</template>

<style scoped>
.footer-container {
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--colors-grey-grey-50, #f1f1f1);
  background-color: #fcfcfd;
  z-index: 0;
  display: flex;
  margin-top: 32px;
  min-height: 94px;
  width: 100%;
  padding: 23px 16px;
  gap: 16px;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 16px;
  color: #fcfcfd;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

.action-button {
  align-self: stretch;
  flex: 1;
  border-radius: 8px;
  box-shadow: 6px 6px 16px 0px rgba(103, 85, 164, 0.1);
  background-color: #e22332;
  min-width: 240px;
  margin: auto 0;
  min-height: 48px;
  width: 100%;
  padding: 15px 12px;
  border: none;
  cursor: pointer;
  color: inherit;
}

@media (max-width: 991px) {
  .footer-container {
    max-width: 100%;
  }

  .action-button {
    max-width: 100%;
  }
}
</style>
<script setup lang="ts">
</script>