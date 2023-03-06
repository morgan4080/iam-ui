<script setup lang="ts">
import Pagination from "@/components/ui/Pagination.vue";
import { Pageables } from "@/types";

defineProps<{
  headers: string[];
  loading: boolean;
  dataLength: number;
  pageables: Pageables;
}>();

const emit = defineEmits(["next", "previous"]);
</script>

<template>
  <div
    class="flex flex-col space-y-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg pb-4"
  >
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="head in headers"
            :key="head"
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
          >
            {{ head }}
          </th>
          <th
            scope="col"
            class="relative py-3.5 pl-3 pr-4 sm:pr-6"
          >
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <slot />
        <tr>
          <td
            v-if="loading"
            :colspan="headers.length + 1"
            class="h-2 animate-pulse bg-gray-300"
          />
        </tr>
        <tr v-if="dataLength === 0 && !loading">
          <td
            :colspan="headers.length + 1"
            align="center"
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
          >
            No Data Available
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :total-records="pageables.totalRecords"
      :records-per-page="pageables.recordsPerPage"
      :current-page="pageables.currentPage"
      @next="emit('next')"
      @previous="emit('previous')"
    />
  </div>
</template>
