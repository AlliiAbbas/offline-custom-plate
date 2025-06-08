<template>
  <div class="py-2 pe-2 mt-2 w-100 bg-light">
    <div class="d-flex justify-content-center align-items-center gap-2 p-2 border rounded bg-white">
      <button
          @click="viewDetails"
          class="btn btn-outline-secondary btn-sm rounded-circle p-2"
          title="View details"
      >
        <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/32abf5f65670aa984c3794a180bfd2b50032ed91?placeholderIfAbsent=true&apiKey=d36c137a2e704300b9d6d34d43f459c9"
            alt="View details"
            class="img-fluid"
            style="width: 20px; height: 20px"
        />
      </button>

      <button
          @click="downloadReport"
          class="btn btn-outline-secondary btn-sm rounded-circle p-2"
          title="Download report"
      >
        <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/999fa0c8d09ba02cb1fb3b81ae3b4bce54c2a807?placeholderIfAbsent=true&apiKey=d36c137a2e704300b9d6d34d43f459c9"
            alt="Download report"
            class="img-fluid"
            style="width: 20px; height: 20px"
        />
      </button>

      <button
          @click="alertAction"
          class="btn btn-outline-danger btn-sm rounded-circle p-2"
          title="Alert"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#E84F5B"
            style="width: 20px; height: 20px"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
function viewDetails() {
  console.log('View details clicked')
}

function downloadReport() {
  console.log('Download report clicked')
}

function alertAction() {
  console.log('Alert action clicked')
}
</script>
