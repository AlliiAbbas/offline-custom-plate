<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center">

      <div class="mb-4 text-center">
        <img src="../../../assets/logo1.png" alt="Logo"/>
      </div>


      <div class="w-100 px-4 text-end">
        <h1 class="fs-5 fw-semibold text-dark mb-3">تسجيل دخول</h1>
        <div class="d-flex align-items-center  mb-3" v-if="!isOnline">
          <div class="network-status-indicator" :class="{ 'offline': !isOnline }"></div>

          <span class="me-2" :class="isOnline ? 'text-success' : 'text-danger'">
            {{ isOnline ? 'متصل بالإنترنت' : 'غير متصل بالإنترنت' }}
          </span>
        </div>
      </div>


      <form @submit.prevent="handleSubmit" class="w-100 position-relative px-4">

        <div class="mb-3">
          <div class="position-relative">
            <input
                class="form-control form-control-lg border-2 ps-4 pe-5"
                :class="{ 'border-danger': errors.email }"
                id="email"
                dir="rtl"
                placeholder="البريد الإلكتروني"
                type="text"
                v-model="form.email"
            />
            <span class="position-absolute end-0 top-50 translate-middle-y pe-3 text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.1667 17.0832H5.83333C3.33333 17.0832 1.66667 15.8332 1.66667 12.9165V7.08317C1.66667 4.1665 3.33333 2.9165 5.83333 2.9165H14.1667C16.6667 2.9165 18.3333 4.1665 18.3333 7.08317V12.9165C18.3333 15.8332 16.6667 17.0832 14.1667 17.0832Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.1667 7.5L11.5583 9.58333C10.7 10.2667 9.29167 10.2667 8.43334 9.58333L5.83334 7.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <small class="text-danger d-block text-end">{{ errors.email }}</small>
        </div>


        <div class="mb-4">

          <div class="position-relative">
            <input
                :type="passwordType"
                id="password"
                dir="rtl"
                placeholder="كلمة المرور"
                v-model="form.password"
                class="form-control form-control-lg border-2 ps-5 pe-5"
                :class="{ 'border-danger': errors.password }"
            />

            <span class="position-absolute end-0 top-50 translate-middle-y pe-3 text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
                <rect x="4.167" y="8.333" width="11.667" height="8.334" rx="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.667 8.333V6.25C6.667 4.179 8.346 2.5 10.417 2.5C12.488 2.5 14.167 4.179 14.167 6.25V8.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 11.667V13.334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>

            <span class="position-absolute start-0 top-50 translate-middle-y ps-3 text-secondary cursor-pointer" @click="togglePassword">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M1.667 10C2.944 6.75 6.25 4.167 10 4.167C13.75 4.167 17.056 6.75 18.333 10C17.056 13.25 13.75 15.833 10 15.833C6.25 15.833 2.944 13.25 1.667 10Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.5 10C12.5 11.381 11.381 12.5 10 12.5C8.619 12.5 7.5 11.381 7.5 10C7.5 8.619 8.619 7.5 10 7.5C11.381 7.5 12.5 8.619 12.5 10Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 4L16 16" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <small class="text-danger d-block text-end">{{ errors.password }}</small>
          <p class="text-danger d-block text-end">{{ loginError }}</p>
        </div>

        <button
            type="submit"
            class="btn btn-danger w-100 py-3 fw-semibold"
            :disabled="loading"
        >
          <span v-if="!loading">تسجيل دخول</span>
          <div v-else class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as Yup from 'yup';

const router = useRouter();
const store = useStore();
const loading = ref(false);
const isOnline = ref(navigator.onLine);
const form = ref({
  email: '',
  password: ''
});
const errors = ref({
  email: '',
  password: ''
});
const passwordType = ref('password');
const loginError = ref('');

const handleNetworkChange = () => {
  isOnline.value = navigator.onLine;
};

// Watch for network status changes
watch(isOnline, (newStatus) => {
  if (!newStatus) {
    loginError.value = 'أنت غير متصل بالإنترنت - سيتم استخدام وضع عدم الاتصال';
  } else {
    loginError.value = '';
  }
});

onMounted(() => {
  window.addEventListener('online', handleNetworkChange);
  window.addEventListener('offline', handleNetworkChange);
});

onUnmounted(() => {
  window.removeEventListener('online', handleNetworkChange);
  window.removeEventListener('offline', handleNetworkChange);
});

const validationSchema = Yup.object().shape({
  email: Yup.string()
      .required('البريد الإلكتروني مطلوب')
      .email('يرجى إدخال بريد إلكتروني صحيح'),
  password: Yup.string()
      .required('كلمة المرور مطلوبة')
      .min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل')
});

const togglePassword = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    errors.value = { email: '', password: '' };
    loginError.value = '';
    await validationSchema.validate(form.value, { abortEarly: false });
    const offlineResponse = await store.dispatch('Auth/userLoginOffline', form.value);
    
    if (offlineResponse) {
      await router.push('/');
    } else {
      loginError.value = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      err.inner.forEach(error => {
        if (error.path) {
          errors.value[error.path] = error.message;
        }
      });
    } else {
      loginError.value = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>

.form-control {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
}


.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}


.border-2 {
  border-width: 1.5px !important;
}


.cursor-pointer {
  cursor: pointer;
}

.form-control {
  text-align: right;
}


.container {
  max-width: 28rem;
}


.text-danger {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}


.text-secondary {
  color: #808080 !important;
}


.form-control:focus + span svg path,
.form-control:focus + span svg rect {
  stroke: #dc3545;
}

.network-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #28a745;
  transition: background-color 0.3s ease;
}

.network-status-indicator.offline {
  background-color: #dc3545;
}
</style>