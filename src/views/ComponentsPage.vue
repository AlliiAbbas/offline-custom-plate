<template>
    <div class="w-full h-full grid grid-cols-12 gap-4">
        <div class="col-span-12">
            <h1>Components Page</h1>
        </div>
        <div class="col-span-12">
            <VehicleInformation />
        </div>
    </div>
</template>

<script setup>
import VehicleInformation from '@/components/CompulsoryInsurance/VehicleInformation.vue';
</script>