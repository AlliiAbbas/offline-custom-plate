<template>
  <div class="table-view-container">
    <div class="table-header ">
      <h2 class="table-title text-end w-100">جدول تأمين السيارات</h2>
    </div>
    <div class="table-wrapper">
      <button @click="syncData" color="danger" class="px-4 m-2 rounded-2 bg-danger border-0 text-white">
        مزامنة البيانات
      </button>
      <ReportsTable ref="reportsTable" />
    </div>
    <div class="pagination-wrapper">
      <TablePagination
        :total-items="totalItems"
        :page-size="pageSize"
        @page-changed="handlePageChange"
      />
    </div>
    <SyncLoader ref="loaderSync"/>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ReportsTable from './ReportsTable.vue'
import TablePagination from './TablePagination.vue'
import SyncLoader from "@/components/SyncLoader.vue";

const reportsTable = ref(null)
const loaderSync = ref(null)
const totalItems = ref(0)
const pageSize = ref(10)

const syncData = () => {
  if (loaderSync.value) {
    loaderSync.value.syncData(true)
  }
}
const handlePageChange = (page) => {
  if (reportsTable.value) {
    reportsTable.value.updatePage(page)
  }
}

// Watch for changes in the total items from the table
watch(() => reportsTable.value?.totalItems, (newTotal) => {
  if (newTotal !== undefined) {
    totalItems.value = newTotal
  }
}, { immediate: true })

onMounted(() => {
  if (reportsTable.value) {
    totalItems.value = reportsTable.value.totalItems
  }
})
</script>

<style scoped>
.table-view-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #f8f9fa;
  padding-left: 1rem;
  gap: 1.5rem;
}

.table-header {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}



.btn-primary {
  background-color: #0d6efd;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  transform: translateY(-1px);
}

.table-wrapper {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.pagination-wrapper {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

@media (max-width: 768px) {
  .table-view-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  .table-header {
    padding: 1rem;
    flex-direction: column;
    align-items: stretch;
  }

  .table-actions {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
  
  .table-wrapper,
  .pagination-wrapper {
    border-radius: 0.25rem;
  }
}
</style>
