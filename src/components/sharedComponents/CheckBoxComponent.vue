<template>
    <div class="d-flex align-items-center">
        <label class="form-check-label d-flex align-items-center">
            <BFormCheckbox
                :modal-value="modalValue"
                :value="true"
                :unchecked-value="false"
                class="mx-2 custom-checkbox"
                @update:modal-value="(value) => emit('update:modalValue', value)"
                @input="handleUpdate"
            ></BFormCheckbox>
            <span>{{ label}}</span>
        </label>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    modalValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:modalValue']);

function handleUpdate(event) {
    emit('modalUpdated', event.target.checked);
}
</script>

<style>
.custom-checkbox .form-check-input:checked {
    background-color: var(--primary-500);
    border-color: var(--primary-500);
}

.custom-checkbox .form-check-input:focus {
    border-color: var(--primary-300);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(254, 226, 226, 0.5);
}
</style>