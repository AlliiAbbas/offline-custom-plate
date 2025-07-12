<template>
  <section class="table-container" dir="rtl">
    <table class="table w-100 table-bordered table-hover bg-white shadow-sm rounded">
      <thead>
        <tr class="align-middle text-center">
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رقم الوثيقة</th>
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
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">تاريخ اصدار الوثيقة</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">المنفذ</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">حاله التأمين</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الضريبه</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">نصف الدمغة النسبية</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رسم الأشراف والرقابة</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رسوم المراجعة واعتماد الوثائق</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">مصاريف الأصدار</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الماركه</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">نوع الترخيص</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">السعة اللترية</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">وزن</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الحموله</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">بروز واطوال</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">وزن زائد</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">عدد الركاب</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">Tractor_parts</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الشكل</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">نوع الملحق</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">نهاية الوثيقة الاساسية</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رقم الوثيقة الاساسية</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">جهة التأمين</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">رقم التليفون</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">محافظة الأصدار</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">PolicyStatus</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الحالة</th>
          <th class="bg-light text-secondary py-3 border-bottom-0 sticky-header">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in paginatedRows" :key="index" class="align-middle hover-row">
          <td class="py-3">{{ row.code }}</td>
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
          <td class="py-3">{{ row.issued_at }}</td>
          <td class="py-3">{{ row.traffic_unit }}</td>
          <td class="py-3">{{ row.insurance_state }}</td>
          <td class="py-3">{{ row.tax }}</td>
          <td class="py-3">{{ row.stamp }}</td>
          <td class="py-3">{{ row.supervision_fees }}</td>
          <td class="py-3">{{ row.review_fees }}</td>
          <td class="py-3">{{ row.issue_fees }}</td>
          <td class="py-3">{{ row.producer }}</td>
          <td class="py-3">{{ row.vehicle_license_type_id }}</td>
          <td class="py-3">{{ row.motor_cc }}</td>
          <td class="py-3">{{ row.vehicle_kg }}</td>
          <td class="py-3">{{ row.wt_kg }}</td>
          <td class="py-3">{{ row.extra_size_percent }}</td>
          <td class="py-3">{{ row.wt_extra }}</td>
          <td class="py-3">{{ row.passengers }}</td>
          <td class="py-3">{{ row.tractor_parts }}</td>
          <td class="py-3">{{ row.vehicle_shape }}</td>
          <td class="py-3">{{ row.attach_type }}</td>
          <td class="py-3">{{ row.attach_to_date }}</td>
          <td class="py-3">{{ row.attach_serial }}</td>
          <td class="py-3">{{ row.Insurance_entity }}</td>
          <td class="py-3">{{ row.owner_phone }}</td>
          <td class="py-3">{{ row.region }}</td>
          <td class="py-3">{{ row.policy_status }}</td>
          <td class="py-3">
            <span :class="getStatusClassSync(row.status)">
              {{ getStatusText(row.status) }}
            </span>
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
          <td :colspan="44" class="text-center">
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
import { getAllData, getDecryptedDataForTable, initDB } from '../../utils/indexedDB'
import { decryptObjectFields, getEncryptedFields, decryptData, isEncrypted } from '../../utils/encryption'
import { useStore } from 'vuex'

const rows = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
let lastDataLength = 0
const showConfirmation = ref(false)
const selectedIndex = ref(null)
const store = useStore()

// دالة للحصول على النص المعروض للحالة
const getStatusText = (status) => {
  if (isEncrypted(status)) {
    // إذا كانت مشفرة، نعرض نص افتراضي
    return 'مُلْغى';
  }
  if (!status || status === 'done') return 'نشط';
  if (status === 'cancel') return 'مُلْغى';
  return 'نشط';
}

// دالة للحصول على الكلاس المناسب للحالة (متزامنة)
const getStatusClassSync = (status) => {
  if (isEncrypted(status)) {
    // إذا كانت مشفرة، نفترض أنها ملغية
    return 'badge bg-danger';
  }
  if (!status || status === 'done') return 'badge bg-success';
  if (status === 'cancel') return 'badge bg-danger';
  return 'badge bg-secondary';
}

const getStatusClass = async (status) => {
  try {
    // إذا كانت القيمة مشفرة، قم بفك تشفيرها أولاً
    if (isEncrypted(status)) {
      const decryptedStatus = await decryptData(status);
      if (decryptedStatus === 'cancel') return 'badge bg-danger';
      if (!decryptedStatus || decryptedStatus === 'done') return 'badge bg-success';
      return 'badge bg-secondary';
    }
    
    // إذا كانت القيمة غير مشفرة
    if (!status || status === 'done') return 'badge bg-success';
    if (status === 'cancel') return 'badge bg-danger';
    return 'badge bg-secondary';
  } catch (error) {
    console.error('خطأ في فك تشفير حالة الوثيقة:', error);
    return 'badge bg-secondary';
  }
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
    const allData = await getAllData();
    const item = rows.value[index];
    
    const matchingItem = allData.find(dbItem => {
      const isMatch = dbItem.data && dbItem.data.id === item.id;
      return isMatch;
    });
    
    if (matchingItem) {
      // تحديث الـ status في العنصر الموجود
      matchingItem.data.status = 'cancel';
      
      // استخدام دالة التحديث الجديدة
      const { updateData } = await import('../../utils/indexedDB');
      await updateData(matchingItem.id, {
        data: matchingItem.data,
        timestamp: matchingItem.timestamp
      });
      
      // تحديث العرض في الجدول
      rows.value[index].status = 'cancel';
      
      lastDataLength = rows.value.length;
      
      setTimeout(() => {
        checkForChanges();
      }, 100);
    }
    
  } catch (error) {
    console.error('خطأ في عملية الإلغاء:', error);
  }
};

const checkForChanges = async () => {
  try {
    const data = await fetchDataFromIndexedDB();
    const currentDataLength = data.length;
    
    if (currentDataLength !== lastDataLength) {
      const uniqueData = data.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );
      
      if (uniqueData.length !== rows.value.length) {
        rows.value = uniqueData;
        lastDataLength = uniqueData.length;
      }
    }
  } catch (error) {
    console.error('خطأ في التحقق من التغييرات في IndexedDB:', error);
  }
};

const setupPolling = () => {
  return setInterval(checkForChanges, 1000);
}

const fetchDataFromIndexedDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction(['calculations'], 'readonly');
    const store = transaction.objectStore('calculations');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = async () => {
        try {
          const rawData = request.result;
          
          if (!rawData || rawData.length === 0) {
            resolve([]);
            return;
          }
          
          const decryptedData = [];
          const seenIds = new Set();
          
          for (const item of rawData) {
            if (item && item.data) {
              try {
                const decryptedItem = await decryptEncryptedData(item.data);
                
                if (decryptedItem && decryptedItem.id && !seenIds.has(decryptedItem.id)) {
                  seenIds.add(decryptedItem.id);
                  decryptedData.push(decryptedItem);
                }
              } catch (decryptError) {
                console.error('ReportsTable: خطأ في فك تشفير العنصر:', decryptError);
              }
            } else if (item && typeof item === 'object') {
              try {
                const decryptedItem = await decryptEncryptedData(item);
                
                if (decryptedItem && decryptedItem.id && !seenIds.has(decryptedItem.id)) {
                  seenIds.add(decryptedItem.id);
                  decryptedData.push(decryptedItem);
                }
              } catch (decryptError) {
                console.error('ReportsTable: خطأ في فك تشفير العنصر:', decryptError);
              }
            }
          }
          
          resolve(decryptedData);
        } catch (error) {
          console.error('ReportsTable: خطأ في معالجة البيانات:', error);
          reject(error);
        }
      };
      
      request.onerror = () => {
        console.error('ReportsTable: خطأ في قراءة البيانات من IndexedDB');
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('خطأ في قراءة البيانات من IndexedDB:', error);
    throw error;
  }
};

const decryptEncryptedData = async (encryptedObject) => {
  try {
    const decryptedObject = {};
    
    for (const [key, value] of Object.entries(encryptedObject)) {
      if (isEncrypted(value)) {
        try {
          const decryptedValue = await decryptData(value);
          decryptedObject[key] = decryptedValue;
        } catch (decryptError) {
          console.error(`ReportsTable: خطأ في فك تشفير ${key}:`, decryptError);
          // للحقل status، نعرض القيمة المشفرة كما هي
          if (key === 'status') {
            decryptedObject[key] = value;
          } else {
            decryptedObject[key] = `[مشفر: ${value.encrypted.substring(0, 10)}...]`;
          }
        }
      } else {
        decryptedObject[key] = value;
      }
    }
    
    return decryptedObject;
  } catch (error) {
    console.error('خطأ في فك تشفير البيانات:', error);
    return null;
  }
};

const testSingleFieldDecryption = async () => {
  try {
    const currentKey = localStorage.getItem('encryptionKey');
    
    if (currentKey) {
      const keyArray = JSON.parse(currentKey);
    }
    
    const { encryptData } = await import('../../utils/encryption');
    
    const testValue = 'شركة التأمين';
    const encryptedTest = await encryptData(testValue);
    
    const decryptedTest = await decryptData(encryptedTest);
    
 
    
    try {
      const decryptedValue = await decryptData(testField);
    } catch (oldError) {
    }
    
    return decryptedTest;
  } catch (error) {
    return null;
  }
};

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
    await testSingleFieldDecryption();
    
    const data = await fetchDataFromIndexedDB();
    
    if (data && data.length > 0) {
      rows.value = data;
      lastDataLength = data.length;
    }
    
    const pollingInterval = setupPolling();
    
    window.reportsTablePollingInterval = pollingInterval;
    
  } catch (error) {
    rows.value = [];
  }
});

onUnmounted(() => {
  if (window.reportsTablePollingInterval) {
    clearInterval(window.reportsTablePollingInterval);
    delete window.reportsTablePollingInterval;
  }
})

defineExpose({
  currentPage,
  totalPages,
  pageSize,
  updatePage,
  totalItems: computed(() => rows.value.length),
  getAllData: async () => {
    try {
      const data = await fetchDataFromIndexedDB();
      const validData = data.filter(item => item && Object.keys(item).length > 0);
      return validData;
    } catch (error) {
      return [];
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 8px;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
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

