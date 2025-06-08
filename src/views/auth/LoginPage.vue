<template>
  <main class="min-vh-100 bg-light overflow-hidden">

    <section class="position-relative d-flex align-items-center justify-content-center min-vh-100 px-4 px-md-5">

      <img
         :src="img"
          alt="background"
          class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
      />


      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="card border-0 shadow p-4 p-md-5 bg-white rounded-4">

              <FormComponent class="w-100"/>

              <div class="d-flex align-items-center justify-content-center gap-1 mt-4">
                <p class="text-muted mb-0 small pb-2">عن طريق</p>
                <img
                    src="../../assets/logo%20SVG%202.svg"
                    alt="logo"
                    class="img-fluid"
                    style="width: 100px;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import FormComponent from '../../components/auth/Login/formComponent.vue'
import img from '../../assets/bg.svg'

</script>


<style scoped>

.shadow {
  box-shadow: 6px 6px 16px rgba(226, 35, 50, 0.15) !important;
}


.card {
  direction: rtl;
}

.position-relative::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
}


@media (max-width: 768px) {
  .card {
    margin: 1rem;
  }
}


.card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}
</style>