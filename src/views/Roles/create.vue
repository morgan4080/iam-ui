<script setup lang="ts">
  import {ref} from "vue";

  const services = ref(<{name: string, description: string, permissions: any[]} []>
    [
      {
        name: 'Presta Lending',
        description: 'Kopesha, leding services',
        permissions: [
          {
            name: "Full kopesha access",
            description: "full service access"
          },
          {
            name: "Read kopesha access",
            description: "Read service access"
          },
          {
            name: "Write kopesha access",
            description: "Write service access"
          }
        ]
      },
      {
        name: 'E-guarantorship',
        description: 'Manage loan guarantor-ship',
        permissions: [
          {
            name: "Full guarantorship access",
            description: "full service access"
          },
          {
            name: "Read guarantorship access",
            description: "Read service access"
          },
          {
            name: "Write guarantorship access",
            description: "Write service access"
          }
        ]
      },
      {
        name: 'B2C',
        description: 'Business to customer service',
        permissions: [
          {
            name: "Full b2c access",
            description: "full service access"
          },
          {
            name: "Read b2c access",
            description: "Read service access"
          },
          {
            name: "Write b2c access",
            description: "Write service access"
          }
        ]
      },
      {
        name: 'C2B',
        description: 'customer to business service',
        permissions: [
          {
            name: "Full c2b access",
            description: "full service access"
          },
          {
            name: "Read c2b access",
            description: "Read service access"
          },
          {
            name: "Write c2b access",
            description: "Write service access"
          }
        ]
      },
      {
        name: 'Easy USSD',
        description: 'Create ussd solutions',
        permissions: [
          {
            name: "Full ussd access",
            description: "full service access"
          },
          {
            name: "Read ussd access",
            description: "Read service access"
          },
          {
            name: "Write ussd access",
            description: "Write service access"
          }
        ]
      }
    ]
  )

  const currentServiceIndex = ref(<number> 0)

  function displayService(servicesIndex: number) {
    currentServiceIndex.value = servicesIndex
  }

  function saveToState() {

  }

</script>
<template>
  <div class="w-full lg:max-w-6xl max-h-screen overflow-y-scroll">
    <form @submit.prevent="saveToState">
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
                <div class="mt-6 pb-12 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-12">
                  <fieldset class="border-t border-b border-gray-200">
                    <legend class="sr-only">Notifications</legend>
                    <div class="divide-y divide-gray-200">
                      <div @click="displayService(i)" v-for="(service, i) in services" :key="i" :class="{'bg-blue-50 relative ' : currentServiceIndex === i }" class="relative flex items-center px-2 py-4 cursor-pointer">
                        <div class="min-w-0 flex-1 text-sm">
                          <label for="comments" class="font-medium text-gray-700">{{ service.name }}</label>
                          <p id="comments-description" class="text-gray-500">{{ service.description }}</p>
                        </div>
                        <div class="ml-3 flex items-center h-5">
                          <input id="comments" aria-describedby="comments-description" name="comments" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                        </div>
                        <div v-if="currentServiceIndex === i" class="absolute top-0 -right-9">
                          <div class="w-0 h-0" style="border-top: 36px solid transparent;border-bottom: 36px solid transparent;border-left: 36px solid rgba(240, 249, 255, 1);"></div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <div class="relative">
                    <h6 class="absolute -top-10 text-sm text-gray-500">Permissions</h6>
                    <fieldset class="bg-blue-50 px-2 border-t border-b border-gray-200">
                      <legend class="sr-only">Permissions</legend>
                      <div class="divide-y divide-gray-200">
                        <div v-for="(permission, i) in services[currentServiceIndex].permissions" :key="i" class="relative flex items-start py-4">
                          <div class="min-w-0 flex-1 text-sm">
                            <label for="comments" class="font-medium text-gray-700">{{ permission.name }}</label>
                            <p class="text-gray-500">{{ permission.description }}</p>
                          </div>
                          <div class="ml-3 flex items-center h-5">
                            <input aria-describedby="comments-description" name="comments" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="flex pb-20 bg-gray-100">
        <div class="ml-auto pt-5 pb-8 px-4">
          <div class="space-x-3">
            <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"> Review: permissions </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
