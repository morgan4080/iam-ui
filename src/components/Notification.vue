<script setup lang="ts">
import { toRefs } from "vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";

const props = defineProps<{
  success?: boolean;
  error?: boolean;
  warning?: boolean;
}>();

const { success, error, warning } = toRefs(props);
</script>
<template>
  <div
    class="flex items-center gap-x-6 py-3 px-6 sm:px-3.5 sm:before:flex-1"
    :class="{
      'bg-red-100': error,
      'bg-orange-100': warning,
      'bg-green-100': success,
    }"
  >
    <p
      class="text-sm leading-6"
      :class="{
        'text-red-500': error,
        'text-orange-400': warning,
        'text-green-600': success,
      }"
    >
      <slot />
    </p>
    <div class="flex flex-1 justify-end">
      <button
        type="button"
        class="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        :class="{
          'text-red-900/70 hover:text-red-900 hover:bg-red-200': error,
          'text-orange-900/70 hover:text-orange-900 hover:bg-orange-200':
            warning,
          'text-green-900/70 hover:text-green-900 hover:bg-green-200': success,
        }"
      >
        <span class="sr-only">Dismiss</span>
        <XMarkIcon
          class="h-5 w-5"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
