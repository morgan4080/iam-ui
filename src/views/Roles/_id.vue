<script setup lang="ts">
  import { getRole } from '@/modules/all'
  import { useRoute } from "vue-router"
  import {ref} from "vue";
  const route = useRoute()

  const role = ref()
  getRole(route.params.id).then((r) => {
    role.value = r
  })
</script>
<template>
  <div class="w-full">
    <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
      <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
        <div class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200">
          <div class="flex-1 min-w-0">
            <div class="ml-3 flex items-center border-b border-gray-200">
              <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Role Description
              </h1>
            </div>

            <div class="m-3">
              {{ JSON.stringify(role) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
