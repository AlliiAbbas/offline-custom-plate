<template>
  <div class="table-view-container">
    <div class="table-header">
      <h2 class="table-title text-end w-100">جدول تأمين السيارات</h2>
    </div>
    <div v-if="showSuccess" class="sync-success-overlay">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="alert alert-success" role="alert">
        تم مزامنة البيانات بنجاح
      </div>
    </div>
    <div v-if="showFailed" class="sync-success-overlay">
      <div class="error-icon">
        <i class="fas fa-times-circle"></i>
      </div>
      <div class="alert alert-danger" role="alert">
        فشلت مزامنة البيانات
      </div>
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
import { clearTable, getAllData, initDB } from '../../utils/indexedDB'
import { getDecryptedDataForTable } from '../../utils/indexedDB'
import { decryptObjectFields, getEncryptedFields } from '../../utils/encryption'
import { useStore } from 'vuex'

const reportsTable = ref(null)
const loaderSync = ref(null)
const totalItems = ref(0)
const pageSize = ref(10)
const showOfflinePopup = ref(false)
const showSuccess = ref(false)
const showFailed = ref(false)
const showClearDataPopup = ref(false)
const store = useStore()

const fetchAllDataFromIndexedDB = async () => {
  try {
    const tableData = await getDecryptedDataForTable();
    console.log('Data for table display (TableView):', tableData);
    return tableData;
  } catch (error) {
    console.error('خطأ في قراءة البيانات من IndexedDB:', error);
    throw error;
  }
};

const handlePageChange = (page) => {
  if (reportsTable.value) {
    reportsTable.value.updatePage(page)
  }
}

const handleSync = async () => {
  if (!navigator.onLine) {
    showOfflinePopup.value = true
    return
  }

  try {
    // إظهار loader
    if (loaderSync.value) {
      loaderSync.value.syncData(true)
    }

    // جلب جميع البيانات من IndexedDB
    const allData = await getAllData()
    
    // if (!allData || allData.length === 0) {
    //   alert('لا توجد بيانات للمزامنة')
    //   if (loaderSync.value) {
    //     loaderSync.value.syncData(false)
    //   }
    //   return
    // }

    // تحويل البيانات إلى الشكل المطلوب للـ API
    const policies = []
    
    for (const item of allData) {
      if (item.data) {
        // فك تشفير البيانات قبل إرسالها للباك إند
        const decryptedData = await decryptObjectFields(item.data, getEncryptedFields())
        policies.push(decryptedData)
      } else {
        // إذا كانت البيانات غير مشفرة، أرسلها كما هي
        policies.push(item)
      }
    }

    // if (policies.length === 0) {
    //   alert('لا توجد بيانات صالحة للمزامنة')
    //   if (loaderSync.value) {
    //     loaderSync.value.syncData(false)
    //   }
    //   return
    // }
    console.log(policies);
    // إرسال البيانات للباك إند
    await store.dispatch('Vehicle/resyncCustomPlate', policies).then(()=>{
      showSuccess.value=true
            setTimeout(() => {
              showSuccess.value = false;
            }, 2000);
      clearTable()
    }).catch(()=>{
      showFailed.value= true
      setTimeout(() => {
        showFailed.value = false;
      }, 2000);
    })
    
    //
    // // إخفاء loader
    if (loaderSync.value) {
      loaderSync.value.syncData(false)
    }
    //
    // إظهار رسالة نجاح

    // // تحديث الجدول
    // if (reportsTable.value) {
    //   // إعادة تحميل البيانات
    //   const data = await reportsTable.value.getAllData()
    //   if (data && data.length > 0) {
    //     reportsTable.value.rows = data
    //   }
    // }
    
  } catch (error) {
    console.error('خطأ في عملية المزامنة:', error)
    alert('فشل في المزامنة: ' + (error.message || 'خطأ غير معروف'))
    
    // إخفاء loader
    // if (loaderSync.value) {
    //   loaderSync.value.syncData(false)
    // }
  }
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
    const allData = await fetchAllDataFromIndexedDB()

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
      'رقم الوثيقة': item.id || '',
      'تاريخ اصدار الوثيقة': item.issued_at || '',
      'المنفذ': item.traffic_unit || '',
      'حاله التأمين': item.insurance_state || '',
      'الضريبه': item.tax || '',
      'نصف الدمغة النسبية': item.stamp || '',
      'رسم الأشراف والرقابة': item.admin_fees || '',
      'رسوم المراجعة واعتماد الوثائق': item.audit_fees || '',
      'مصاريف الأصدار': item.issue_fees || '',
      'الماركه': item.producer || '',
      'نوع الترخيص': item.vehicle_license_type || '',
      'السعة اللترية': item.motor_cc || '',
      'وزن': item.vehicle_kg || '',
      'الحموله': item.wt_kg || '',
      'بروز واطوال': item.extra_size_percent || '',
      'وزن زائد': item.wt_extra || '',
      'عدد الركاب': item.passengers || '',
      'Tractor_parts': item.tractor_parts || '',
      'الشكل': item.vehicle_shape || '',
      'نوغ الملحق': item.attach_type || '',
      'نهاية الوثيقة الاساسية': item.attach_to_date || '',
      'رقم الوثيقة الاساسية': item.attach_serial || '',
      'جهة التأمين': item.Insurance_entity || '',
      'رقم التليفون': item.owner_phone || '',
      'محافظة الأصدار': item.region || '',
      'PolicyStatus': item.policy_status || '',
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
.alert-danger{
  background-color: #dc3545 !important;
  color:white !important;
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
.sync-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.sync-loader-content {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sync-success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.sync-success-content {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.success-icon {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}
.error-icon {
  font-size: 3rem;
  color: #b52020;
  margin-bottom: 1rem;
}

.alert {
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>
