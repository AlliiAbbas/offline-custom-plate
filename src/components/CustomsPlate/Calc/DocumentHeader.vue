<template>
  <header class="header-container">
    <h1 class="header-title">حساب الوثيقة</h1>
    <img src="@/assets/backIcon.svg" @click="$emit('closePopup')" alt="Document icon" class="header-icon" />
  </header>
</template>

<style scoped>
.header-container {
  justify-content: end;
  align-items: center;
  border-bottom: 1px solid var(--colors-grey-grey-50, #f1f1f1);
  background-color: #fcfcfd;
  z-index: 0;
  display: flex;
  min-height: 64px;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;
}

.header-title {
  align-self: stretch;
  min-width: 240px;
  margin: auto 0;
  padding: 0 70px;
  width: 277px;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 20px;
  color: #010202;
  font-weight: 700;
  text-align: right;
}

.header-icon {
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 20px;
  align-self: stretch;
  margin: auto 0;
  flex-shrink: 0;
  cursor: pointer;
}

@media (max-width: 991px) {
  .header-container {
    max-width: 100%;
  }
}
</style>
<script setup lang="ts">
</script>