<script setup lang="ts">
  import { getAccessToken, getUsers } from '@/modules/all'
  import { ref } from "vue"

  const allUsers = ref(<any[]>[
    {
      isEnabled: '',
      userType: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      id: ''
    },
    {
      isEnabled: '',
      userType: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      id: ''
    }
  ])

  getAccessToken()
  .then((token: string) => getUsers(token))
  .then((users: {isEnabled: boolean,userType: string, email: string, firstName: string, lastName: string, phoneNumber: string, id: string }[]) => {
    allUsers.value = users
  }).catch((e: any) => {
    console.log(e)
    alert("User fetch Error")
  })
</script>

<template>
  <div class="flex-col h-screen w-full overflow-y-auto" style="min-height: 640px;">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-3 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div class="flex-1 min-w-0">
          <div class="flex flex-col">
            <div class="py-10 sm:py-6 flex flex-wrap items-center justify-start space-y-0 sm:flex-row sm:items-end">
              <div class="space-x-2">
                <button @click="$router.push('/new-users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
                  Add user
                </button>

                <button type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500">
                  Disable user
                </button>
              </div>

              <span class="relative z-0 inline-flex shadow-sm rounded-md ml-auto">
                <button type="button" class="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button type="button" class="-ml-px relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
            <div class="-my-2 pt-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input class="rounded" type="checkbox">
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(user) in allUsers" :key="user.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input class="rounded" type="checkbox">
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <router-link :to="`/users/${user.id}`">
                          <span v-if="user.firstName === '' && user.lastName === ''" class="h-4 w-12 bg-gray-200 block rounded animate-pulse"></span>
                          {{ user.firstName }} {{ user.lastName }}
                        </router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <router-link :to="`/users/${user.id}`">
                          <span v-if="user.phoneNumber === ''" class="h-4 w-12 bg-gray-200 block rounded animate-pulse"></span>
                          {{ user.phoneNumber }}
                        </router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <router-link :to="`/users/${user.id}`">
                          <span v-if="user.email === ''" class="h-4 w-12 bg-gray-200 block rounded animate-pulse"></span>
                          {{ user.email }}
                        </router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 lowercase">
                        <router-link :to="`/users/${user.id}`">
                          <span v-if="user.userType === ''" class="h-4 w-8 bg-gray-200 block rounded animate-pulse"></span>
                          {{ user.userType }}
                        </router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <router-link :to="`/users/${user.id}`">
                          <span v-if="user.isEnabled" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Enabled
                          </span>
                          <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Disabled
                          </span>
                        </router-link>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <router-link v-if="user.id" :to="`/users/${user.id}/edit`" class="text-blue-600 hover:text-blue-900">Edit</router-link>
                      </td>
                    </tr>

                    <!-- More people... -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
