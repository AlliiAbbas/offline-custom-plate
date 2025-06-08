<template>
  <article class="card border h-100 text-center py-4 cursor-pointer">
    <div class="card-body d-flex flex-column align-items-center justify-content-center">

      <div class="image-container mb-4">
        <div class="rounded-circle bg-light d-flex align-items-center justify-content-center" style="width: 120px; height: 130px; border: 1px solid #f3f4f6;">
          <img
              :src="imageSrc"
              :alt="altText"
              class="img-fluid"
              style="width: 55px; object-fit: contain;"
              loading="lazy"
          />
        </div>
      </div>


      <h2 class="card-title mt-3 fs-6 fw-medium text-dark">
        {{ title }}
      </h2>
    </div>
  </article>
</template>

<script setup>
defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  altText: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
  border-color: #e5e7eb !important;
  border-radius: 0.5rem;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.image-container {
  width: 150px;
  padding: 1rem;
}

.rounded-circle {
  
}


.cursor-pointer {
  cursor: pointer;
}


.card {
  direction: rtl;
}


@media (max-width: 768px) {
  .image-container {
    width: 180px;
  }

  .rounded-circle {
    width: 140px;
    height: 140px;
  }
}
</style>
