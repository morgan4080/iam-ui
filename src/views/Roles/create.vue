<script setup lang="ts">
  import {ref} from "vue";

  const services = ref(<{name: string,permissions: []} []>
    [
      {
        name: 'Presta Lending',
        permissions: [

        ]
      },
      {
        name: 'E-guarantorship',
        permissions: [

        ]
      },
      {
        name: 'B2C',
        permissions: [

        ]
      },
      {
        name: 'C2B',
        permissions: [

        ]
      }
    ]
  )
</script>
<template>
  <div class="w-full lg:max-w-6xl">
    <form>
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="shadow sm:overflow-hidden">
            <div class="bg-white py-6 px-4 sm:p-6">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Create Role
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  This information will be used configure service permissions.
                </p>
              </div>
              <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Role name
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input type="text" name="username" id="username" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300">
                    </div>
                  </div>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="about" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Description
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea id="about" name="about" rows="3" class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"></textarea>
                    <p class="mt-2 text-sm text-gray-500">Write a short description about the role.</p>
                  </div>
                </div>
                <div class="mt-10 divide-y divide-gray-200">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Services
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                      Assign service permissions to role.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </form>
  </div>
</template>
