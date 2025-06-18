<template>
  <div class="table-view-container">
    <div class="table-header">
      <h2 class="table-title text-end w-100">جدول تأمين السيارات</h2>
    </div>

    <div class="table-wrapper">
      <button @click="handleSync" class="px-4 m-2 rounded-2 bg-danger border-0 text-white">
        مزامنة البيانات
      </button>

      <button @click="exportToExcel" class="px-4 m-2 rounded-2 bg-success border-0 text-white">
        تصدير
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

    <SyncLoader ref="loaderSync" />
  </div>

  <!-- Offline Sync Popup -->
  <div v-if="showOfflinePopup" class="offline-popup-overlay">
    <div class="offline-popup">
      <div class="offline-popup-content">
        <div class="offline-popup-icon">
          <i class="fas fa-wifi-slash"></i>
        </div>
        <h3>تنبيه</h3>
        <p>المزامنة تكون في وضع الاتصال فقط</p>
        <button @click="showOfflinePopup = false" class="offline-popup-button">حسناً</button>
      </div>
    </div>
  </div>

  <!-- Clear Data Confirmation Popup -->
  <div v-if="showClearDataPopup" class="offline-popup-overlay">
    <div class="offline-popup">
      <div class="offline-popup-content">
        <div class="offline-popup-icon">
          <i class="fas fa-trash"></i>
        </div>
        <h3>مسح البيانات</h3>
        <p>هل تريد مسح البيانات من قاعدة البيانات المحلية؟</p>
        <div class="popup-buttons">
          <button @click="clearIndexedDBData" class="offline-popup-button bg-danger">نعم، امسح البيانات</button>
          <button @click="showClearDataPopup = false" class="offline-popup-button bg-secondary">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import ReportsTable from './ReportsTable.vue'
import TablePagination from './TablePagination.vue'
import SyncLoader from '../../components/SyncLoader.vue'
const reportsTable = ref(null)
import {clearTable} from '../../utils/indexedDB'
const loaderSync = ref(null)
const totalItems = ref(0)
const pageSize = ref(10)
const showOfflinePopup = ref(false)
const showClearDataPopup = ref(false)

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

const handleSync = () => {
  if (!navigator.onLine) {
    showOfflinePopup.value = true
    return
  }
  syncData()
}

const clearIndexedDBData = async () => {
  try {
    await clearTable()
    showClearDataPopup.value = false
  } catch (error) {
    console.error('Error clearing IndexedDB:', error)
    alert('حدث خطأ أثناء مسح البيانات')
  }
}

const exportToExcel = async () => {
  try {
    if (!reportsTable.value?.getAllData) {
      console.warn("getAllData method is not defined in ReportsTable")
      return
    }

    const allData = await reportsTable.value.getAllData()

    if (!allData || allData.length === 0) {
      alert("لا توجد بيانات للتصدير")
      return
    }

    // Format the data for Excel
    const formattedData = allData

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تقرير تأمين السيارات')
    
    // Set column widths
    const wscols = Object.keys(formattedData[0]).map(() => ({ wch: 15 }))
    worksheet['!cols'] = wscols

    XLSX.writeFile(workbook, 'تقرير_نسخة_المزامنة.xlsx')
    const formattedData2 = allData.map(item => ({
      'رقم الوثيقة': item.code || '',
      'اسم المالك': item.owner_name || '',
      'الرقم القومي': item.owner_national_id || '',
      'العنوان': item.owner_address || '',
      'الوظيفه': item.owner_job || '',
      'الطراز': item.model || '',
      'سنه الصنع': item.year || '',
      'رقم اللوحه': item.plate || '',
      'رقم الشاسيه': item.chassis_id || '',
      'رقم الموتور': item.motor_id || '',
      'السلندرات': item.cylinders || '',
      'نوع الوقود': item.fuel_type_id || '',
      'اخر شركه تامين': item.insurance_last_vendor || '',
      'من تاريخ': item.from_date || '',
      'الى تاريخ': item.to_date || '',
      'صافي القسط': item.net_premium || '',
      'الاجمالي': item.total_sum || '',
      'الحالة': item.status === 'cancel' ? 'مُلْغى' : 'نشط'
    }))
    // Set column widths
    const worksheet2 = XLSX.utils.json_to_sheet(formattedData2)
    const workbook2 = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook2, worksheet2, 'تقرير تأمين السيارات')
    worksheet['!cols'] = Object.keys(formattedData2[0]).map(() => ({wch: 15}))

    XLSX.writeFile(workbook2, 'تقرير_تأمين_السيارات.xlsx')
    // Show confirmation popup after successful export
    showClearDataPopup.value = true
    
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert('حدث خطأ أثناء تصدير البيانات')
  }
}

// Watch for changes in the total items from the table
watch(
    () => reportsTable.value?.totalItems,
    (newTotal) => {
      if (newTotal !== undefined) {
        totalItems.value = newTotal
      }
    },
    { immediate: true }
)

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

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .table-wrapper,
  .pagination-wrapper {
    border-radius: 0.25rem;
  }
}

.offline-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.offline-popup {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.offline-popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.offline-popup-icon {
  font-size: 40px;
  color: #dc3545;
}

.offline-popup h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.offline-popup p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.offline-popup-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.offline-popup-button:hover {
  background-color: #c82333;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.offline-popup-button {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  color: white;
}

.offline-popup-button:hover {
  opacity: 0.9;
}

.bg-danger {
  background-color: #dc3545;
}

.bg-secondary {
  background-color: #6c757d;
}
</style>
