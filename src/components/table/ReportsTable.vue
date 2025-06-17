<template>
  <section class="table-container" dir="rtl">
    <table class="table w-100 table-bordered table-hover bg-white shadow-sm rounded">
      <thead>
        <tr class="align-middle text-center">
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">اسم المالك</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الرقم القومي</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">العنوان</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الوظيفه</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الطراز</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">سنه الصنع</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رقم اللوحه</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رقم الشاسيه</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رقم الموتور</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">السلندرات</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">نوع الوقود</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">اخر شركه تامين</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">من تاريخ</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الى تاريخ</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">صافي القسط</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الاجمالي</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الحالة</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in paginatedRows" :key="index" class="align-middle hover-row">
          <td class="py-3">{{ row.owner_name }}</td>
          <td class="py-3">{{ row.owner_national_id }}</td>
          <td class="py-3">{{ row.owner_address }}</td>
          <td class="py-3">{{ row.owner_job }}</td>
          <td class="py-3">{{ row.model }}</td>
          <td class="py-3">{{ row.year }}</td>
          <td class="py-3">{{ row.plate }}</td>
          <td class="py-3">{{ row.chassis_id }}</td>
          <td class="py-3">{{ row.motor_id }}</td>
          <td class="py-3">{{ row.cylinders }}</td>
          <td class="py-3">{{ row.fuel_type_id }}</td>
          <td class="py-3">{{ row.insurance_last_vendor }}</td>
          <td class="py-3">{{ row.from_date }}</td>
          <td class="py-3">{{ row.to_date }}</td>
          <td class="py-3">{{ row.net_premium }}</td>
          <td class="py-3">{{ row.total_sum }}</td>
          <td class="py-3">
            <span :class="getStatusClass(row.status)">{{ row.status=== 'cancel' ? ' مُلْغى' : 'نشط' }}</span>
          </td>
          <td class="py-3">
            <button 
              v-if="!row.status || row.status === 'done'"
              @click="showCancelConfirmation(index)" 
              class="btn btn-danger btn-sm"
            >
              <i class="bi bi-x-circle me-1"></i>
              إلغاء
            </button>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="18" class="text-center">
            <div class="empty-state">
              <i class="bi bi-inbox text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-3 mb-0">لا توجد بيانات</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmation" class="confirmation-dialog">
      <div class="confirmation-content">
        <h4>تأكيد الإلغاء</h4>
        <p>هل أنت متأكد من إلغاء هذا العنصر؟</p>
        <div class="confirmation-actions">
          <button @click="confirmCancel" class="btn btn-danger">تأكيد</button>
          <button @click="hideConfirmation" class="btn btn-secondary">إلغاء</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const rows = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
let lastDataLength = 0
const showConfirmation = ref(false)
const selectedIndex = ref(null)

const getStatusClass = (status) => {
  if (!status || status === 'done') return 'badge bg-success'
  if (status === 'cancel') return 'badge bg-danger'
  return 'badge bg-secondary'
}

const showCancelConfirmation = (index) => {
  selectedIndex.value = index
  showConfirmation.value = true
}

const hideConfirmation = () => {
  showConfirmation.value = false
  selectedIndex.value = null
}

const confirmCancel = async () => {
  if (selectedIndex.value !== null) {
    await handleCancel(selectedIndex.value)
    hideConfirmation()
  }
}

const handleCancel = async (index) => {
  try {
    const db = await openIndexedDB()
    const transaction = db.transaction(['calculations'], 'readwrite')
    const store = transaction.objectStore('calculations')
    
    const item = rows.value[index]
    console.log('Current item id:', item.id)
    
    // Get all items and find the matching one
    const getAllRequest = store.getAll()
    
    getAllRequest.onsuccess = (event) => {
      const allItems = event.target.result
      console.log('Current item id:', item)
      console.log('All items in DB:', allItems.map(item => ({ id: item.id })))
      
      // Find the matching item by id
      const matchingItem = allItems.find(dbItem => {
        const isMatch = dbItem.data.id === item.id
        return isMatch
      })
      
      if (matchingItem) {
        console.log('Found matching item:', matchingItem)
        // Update the status
        matchingItem.data.status = 'cancel'
        
        // Put the updated item back
        const putRequest = store.put(matchingItem)
        
        putRequest.onsuccess = () => {
          console.log('Successfully updated status to cancel')
          // Update local state
          rows.value[index].status = 'cancel'
        }
      } else {
        console.log('No matching item found - Check if id exists')
      }
    }
    
  } catch (error) {
    console.error('Error in handleCancel:', error)
  }
}

const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('customsPlateDB', 1)
    
    request.onerror = (event) => reject(event)
    request.onsuccess = (event) => resolve(event.target.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('calculations')) {
        db.createObjectStore('calculations', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

// Add function to check for IndexedDB changes
const checkForChanges = async () => {
  try {
    const data = await fetchDataFromIndexedDB()
    const currentDataLength = data.length
    
    // If data length has changed or data content has changed
    if (currentDataLength !== lastDataLength) {
      rows.value = data.filter(item => Object.keys(item).length > 0)
      lastDataLength = currentDataLength
    }
  } catch (error) {
    console.error('خطأ في التحقق من التغييرات', error)
  }
}

// Setup polling interval
const setupPolling = () => {
  // Check for changes every 1 second
  setInterval(checkForChanges, 1000)
}

const fetchDataFromIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('customsPlateDB', 1)

    request.onerror = (event) => {
      console.error('خطأ في فتح قاعدة البيانات', event)
      reject(event)
    }

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['calculations'], 'readonly')
      const objectStore = transaction.objectStore('calculations')
      const getAllRequest = objectStore.getAll()

      getAllRequest.onsuccess = (event) => {
        const allData = event.target.result
        // Transform the data to match the new structure
        const transformedData = allData.map(item => {
          // If the data is already in the new format, return it as is
          if (item.owner_name) {
            return item
          }
          // If the data is in the old format, transform it
          if (item.data) {
            return item.data
          }
          // Return empty object if data structure is unknown
          return {}
        })
        resolve(transformedData)
      }

      getAllRequest.onerror = (event) => {
        console.error('خطأ في قراءة البيانات', event)
        reject(event)
      }
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('calculations')) {
        db.createObjectStore('calculations', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

const totalPages = computed(() => Math.ceil(rows.value.length / pageSize.value))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return rows.value.slice(start, end)
})

const updatePage = (page) => {
  currentPage.value = page
}

onMounted(async () => {
  try {
    const data = await fetchDataFromIndexedDB()
    rows.value = data.filter(item => Object.keys(item).length > 0)
    lastDataLength = data.length
    setupPolling() // Start polling for changes
  } catch (error) {
    console.error('خطأ في جلب البيانات من IndexedDB', error)
    rows.value = []
  }
})

// Clean up interval when component is unmounted
onUnmounted(() => {
  clearInterval(setupPolling)
})

// Expose pagination data and methods to parent
defineExpose({
  currentPage,
  totalPages,
  pageSize,
  updatePage,
  totalItems: computed(() => rows.value.length),
  getAllData: async () => {
    try {
      const data = await fetchDataFromIndexedDB()
      return data.filter(item => Object.keys(item).length > 0)
    } catch (error) {
      console.error('Error fetching data for export:', error)
      return []
    }
  }
})
</script>

<style scoped>
.table-container {
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: white;
  border: 1px solid #e9ecef;
}

.table {
  margin-bottom: 0;
  width: 100%;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  font-weight: 600;
  white-space: nowrap;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  padding: 1rem 0.75rem;
  color: #495057;
  font-size: 0.95rem;
  position: sticky;
  top: 0;
  z-index: 2;
  transition: background-color 0.2s ease;
}

.table th:hover {
  background-color: #e9ecef;
}

.table td {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0.75rem;
  vertical-align: middle;
  color: #212529;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.hover-row:hover {
  background-color: #f8f9fa;
  cursor: pointer;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 1rem;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #adb5bd;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}

/* Custom scrollbar styling */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Zebra striping */
.table tbody tr:nth-child(even) {
  background-color: #fafbfc;
}

/* Text alignment */
.table th, .table td {
  text-align: right;
}

/* Add subtle transition for all interactive elements */
.table-container, .table th, .table td, .hover-row {
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-container {
    max-height: 400px;
    border-radius: 8px;
  }
  
  .table td, .table th {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-state i {
    font-size: 2.5rem;
  }
}

/* Add loading state */
.table-container.loading {
  position: relative;
  min-height: 200px;
}

.table-container.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.badge {
  padding: 0.5em 0.75em;
  font-size: 0.875em;
  font-weight: 500;
  border-radius: 0.375rem;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
  transform: translateY(-1px);
}

/* Confirmation Dialog Styles */
.confirmation-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirmation-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.confirmation-content h4 {
  margin-bottom: 1rem;
  color: #dc3545;
}

.confirmation-content p {
  margin-bottom: 1.5rem;
  color: #6c757d;
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirmation-actions button {
  min-width: 100px;
}

.btn-danger i {
  font-size: 0.9rem;
}
</style>

