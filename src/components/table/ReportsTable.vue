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
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="16" class="text-center py-5">
            <div class="empty-state">
              <i class="bi bi-inbox text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-3 mb-0">لا توجد بيانات</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const rows = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
let lastDataLength = 0

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
  totalItems: computed(() => rows.value.length)
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
</style>

