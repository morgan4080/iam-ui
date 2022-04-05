<script setup lang="ts">
import {toRefs} from "vue";

  const props = defineProps<{
    success?: boolean,
    error?: boolean,
    warning?: boolean
  }>()

const { success, error, warning } = toRefs(props);
</script>
<template>
  <div class="relative">
    <div :class="{ 'border-r-4 border-red-500' : error, 'border-r-4 border-yellow-500' : warning, 'border-r-4 border-green-500' : success, }" class="absolute p-4 top-2 right-4 h-auto bg-gray-800 shadow-md rounded-md text-sm text-white flex items-center" style="min-width: 200px;">
      <slot></slot>
    </div>
  </div>
</template>
