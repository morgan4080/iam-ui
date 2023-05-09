<script setup lang="ts">
import {
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/vue/20/solid";
import { Pageables } from "@/types";

const props = defineProps<{
  title: string;
  loading: boolean;
  pageables: Pageables;
  description: string;
}>();

const emit = defineEmits(["sort", "search", "sync"]);
</script>

<template>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold leading-6 text-gray-900">
        {{ title }}
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        {{ description }}
      </p>
    </div>
    <div class="flex space-x-4 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <div
        class="flex items-center hover:cursor-pointer"
        @click.prevent="emit('sync')"
      >
        <ArrowPathIcon
          class="h-6 w-6 text-gray-400"
          :class="loading && 'animate-spin'"
        />
      </div>
      <div class="flex rounded-md relative" style="min-width: 250px;">
        <div class="relative flex focus-within:z-10 w-full">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <MagnifyingGlassIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            v-model="pageables.searchTerm"
            type="search"
            name="search"
            class="w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 rounded-r-md text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            placeholder="Search term"
            @change="emit('search')"
          />
        </div>
        <button
          type="button"
          class="absolute right-0 w-20 h-full -ml-px flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="emit('sort')"
        >
          <BarsArrowUpIcon
            v-if="pageables.sort === 'ASC'"
            class="-ml-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <BarsArrowDownIcon
            v-if="pageables.sort === 'DESC'"
            class="-ml-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />

          Sort
        </button>
      </div>

      <!--      <div class="flex rounded-md shadow-sm">
        <div class="relative flex focus-within:z-10">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <MagnifyingGlassIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            v-model="pageables.searchTerm"
            type="search"
            name="search"
            class="block rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            placeholder="Search term"
            @change="emit('search')"
          />
        </div>
        <button
          type="button"
          class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="emit('sort')"
        >
          <BarsArrowUpIcon
            v-if="pageables.sort === 'ASC'"
            class="-ml-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <BarsArrowDownIcon
            v-if="pageables.sort === 'DESC'"
            class="-ml-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />

          Sort
        </button>
      </div>-->

      <slot name="actionButton" />
    </div>
  </div>
</template>
