<template>
  <button
      class="btn btn-outline-secondary px-3 py-1 mx-1 btn-sm"
      :class="{ active: isActive }"
      @click="$emit('click')"
  >
    {{ page }}
  </button>
</template>

<script>
export default {
  name: 'PageButton',
  props: {
    page: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>
