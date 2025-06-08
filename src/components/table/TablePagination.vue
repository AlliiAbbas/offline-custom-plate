<template>
  <footer class="container  " dir="rtl">
    <div class="row align-items-center">
      <div class="col-md-auto d-flex flex-wrap align-items-center gap-2">
        <button 
          @click="goToFirstPage" 
          class="btn btn-outline-secondary btn-sm" 
          aria-label="First"
          :disabled="currentPage === 1"
        >
          «
        </button>
        <button 
          @click="goToPreviousPage" 
          class="btn btn-outline-secondary btn-sm" 
          aria-label="Previous"
          :disabled="currentPage === 1"
        >
          ‹
        </button>

        <div class="pagination mb-0">
          <PageButton
              v-for="page in visiblePages"
              :key="`page-${page}`"
              :page="page"
              :isActive="currentPage === page"
              @click="goToPage(page)"
          />
          <span v-if="showEllipsis" class="page-item disabled"><span class="page-link">...</span></span>
          <PageButton
              v-if="totalPages > 7"
              :page="totalPages"
              :isActive="currentPage === totalPages"
              @click="goToPage(totalPages)"
          />
        </div>

        <button 
          @click="goToNextPage" 
          class="btn btn-outline-secondary btn-sm" 
          aria-label="Next"
          :disabled="currentPage === totalPages"
        >
          ›
        </button>
        <button 
          @click="goToLastPage" 
          class="btn btn-outline-secondary btn-sm" 
          aria-label="Last"
          :disabled="currentPage === totalPages"
        >
          »
        </button>
      </div>

      <div class="col-md-auto ms-auto">
        <small class="text-muted">
          اظهار {{ firstEntry }} الي {{ lastEntry }} من {{ totalItems }} مدخل
        </small>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import PageButton from './PageButton.vue'

const props = defineProps({
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  }
})

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))
const firstEntry = computed(() => ((currentPage.value - 1) * props.pageSize) + 1)
const lastEntry = computed(() => Math.min(currentPage.value * props.pageSize, props.totalItems))

const visiblePages = computed(() => {
  if (totalPages.value <= 7) return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  if (currentPage.value <= 4) return [1, 2, 3, 4, 5, 6]
  if (currentPage.value >= totalPages.value - 3) return Array.from({ length: 6 }, (_, i) => totalPages.value - 5 + i)
  return [currentPage.value - 2, currentPage.value - 1, currentPage.value, currentPage.value + 1, currentPage.value + 2]
})

const showEllipsis = computed(() => totalPages.value > 7)

function goToPage(page) {
  currentPage.value = page
  emit('page-changed', page)
}

function goToFirstPage() {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    emit('page-changed', 1)
  }
}

function goToLastPage() {
  if (currentPage.value !== totalPages.value) {
    currentPage.value = totalPages.value
    emit('page-changed', totalPages.value)
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    emit('page-changed', currentPage.value)
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    emit('page-changed', currentPage.value)
  }
}

const emit = defineEmits(['page-changed'])
</script>

<style scoped>
.pagination {
  margin: 0;
  display: flex;
  gap: 0.25rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gap-2 {
  gap: 0.5rem !important;
}
</style>
