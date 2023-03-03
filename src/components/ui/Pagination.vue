<script setup lang="ts">
import {computed} from "vue";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/20/solid";

const props = defineProps<{
  currentPage: number;
  recordsPerPage: number;
  totalRecords: number;
}>();

const emit = defineEmits(["next", "previous"]);

const from = computed(() =>
    props.currentPage === 1
        ? 1
        : (props.currentPage - 1) * props.recordsPerPage + 1
);
const to = computed(() =>
    props.currentPage === 1
        ? props.currentPage * props.recordsPerPage > props.totalRecords ? props.totalRecords : props.recordsPerPage
        : props.currentPage * props.recordsPerPage > props.totalRecords
            ? props.totalRecords
            : props.currentPage * props.recordsPerPage
);
</script>

<template>
  <div
      class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between pl-4 pr-3"
  >
    <div>
      <p class="text-sm text-gray-700">
        Showing
        {{ " " }}
        <span class="font-medium">{{ from }}</span>
        {{ " " }}
        to
        {{ " " }}
        <span class="font-medium">{{ to }}</span>
        {{ " " }}
        of
        {{ " " }}
        <span class="font-medium">{{ totalRecords }}</span>
        {{ " " }}
        results
      </p>
    </div>
    <div>
      <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
      >
        <a
            href="#"
            @click.prevent="emit('previous')"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon
              class="h-5 w-5"
              aria-hidden="true"
          />
        </a>
        <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
        <button
            type="button"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          {{ currentPage }}
        </button>
        <a
            href="#"
            @click.prevent="emit('next')"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon
              class="h-5 w-5"
              aria-hidden="true"
          />
        </a>
      </nav>
    </div>
  </div>
</template>
