<script setup lang="ts">
import { createPopper } from '@popperjs/core'
  import { getAccessToken, getUsers } from '@/modules/all'
  import { ref, reactive, watch } from "vue"
  import { useRoute } from "vue-router";

  const route = useRoute()

  const allUsers = ref(<{ isEnabled: boolean, userType: string, email: string, firstName: string, lastName: string, phoneNumber: string, id: string }[]>[])

  const totalRecords = ref(<number>0)

  const pageCountOpen = ref(<boolean>false)

  const activeIndex = ref(<any>null)

  const selectedIndex = ref(<any>null)

  const lots = ref(<number[]>[10, 50, 100])

  const totalPages = ref(<number>0)

  const currentPage = ref(<number>0)

  const totalPagesArray = ref(<number[]>[])

  const filterForm = reactive({
    recordsPerPage: 10,
    searchTerm: '',
    order: 'ASC',
    page: currentPage.value
  })

  /*watch(
      () =>[ filterForm.recordsPerPage, filterForm.searchTerm, filterForm.order, filterForm.page ],
      () => {
        console.log("watching", filterForm)
      }
  )
*/
  const popcorn = ref(<any>null)
  const tooltip = ref(<any>null)

  watch(
      pageCountOpen,
      () => {
        console.log("pageCountOpen", pageCountOpen.value)
        if (pageCountOpen.value) {
          console.log(popcorn.value, tooltip.value)
          createPopper(popcorn.value, tooltip.value,{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [5, 10],
                },
              },
            ],
          });
        }
      }
  )

  const choose = (index: number) => {
    selectedIndex.value = index
    filterForm.recordsPerPage = lots.value[index]
    pageCountOpen.value = !pageCountOpen.value
  }

  const query = ref(<string>`?order=ASC&sort=ASC&pageSize=${filterForm.recordsPerPage}`)

  const refresh = () => {
    allUsers.value = [
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      },
      {
        isEnabled: true,
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        id: ''
      }
    ]
    getAccessToken()
        .then((token?: string) => getUsers(token, query.value))
        .then((data: { totalRecords: number, totalPages: number, currentPage: number, records: { isEnabled: boolean, userType: string, email: string, firstName: string, lastName: string, phoneNumber: string, id: string }[] }) => {
          totalRecords.value = data.totalRecords
          totalPages.value = data.totalPages
          for (let i = 1; i <= totalPages.value; i++ ) {
            totalPagesArray.value = [...totalPagesArray.value, ...[i]]
          }
          currentPage.value = data.currentPage + 1
          allUsers.value = data.records
        }).catch((e: any) => {
      console.log(e)
      alert("User fetch Error")
    })
  }

  refresh()
</script>

<template>
  <div class="w-full bg-white lg:max-w-6xl max-h-screen overflow-y-scroll ">
    <div class="pb-24 sm:px-6 lg:px-0 lg:col-span-9">
      <section>
        <div class="py-6 px-4 sm:p-6 flex flex-wrap items-center justify-start">
          <div class="space-x-2 flex justify-between">
            <button @click="$router.push('/admin/users/create')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded shadow-sm text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
              Add user
            </button>
          </div>

          <div class="relative flex-none z-0 inline-flex rounded-md ml-auto">
            <div class="relative h-8 rounded-md mr-2 shadow-sm">
              <div class="absolute inset-y-0 left-0 flex items-center">
                <label for="filter" class="sr-only">Filter</label>
                <select id="filter" class="h-full py-0 pl-4 pr-6 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-sm">
                  <option>ASC</option>
                  <option>DESC</option>
                </select>
              </div>
              <input type="text" id="search" class="px-4 py-1 h-full block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md text-sm" placeholder="search term...">
            </div>
            <button @click="refresh" type="button" class="shadow-sm relative inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section>
        <div class="py-6 px-4 sm:p-6">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
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
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edit
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user) in allUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <router-link :to="`/admin/users/${user.id}`">
                  <span v-if="user.firstName === '' && user.lastName === ''" class="h-4 w-12 bg-gray-400 block rounded animate-pulse"></span>
                  {{ user.firstName }} {{ user.lastName }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <router-link :to="`/admin/users/${user.id}`">
                  <span v-if="user.phoneNumber === ''" class="h-4 w-12 bg-gray-400 block rounded animate-pulse"></span>
                  {{ user.phoneNumber }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <router-link :to="`/admin/users/${user.id}`">
                  <span v-if="user.email === ''" class="h-4 w-12 bg-gray-400 block rounded animate-pulse"></span>
                  {{ user.email }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 lowercase">
                <router-link :to="`/admin/users/${user.id}`">
                  <span v-if="user.userType === ''" class="h-4 w-8 bg-gray-400 block rounded animate-pulse"></span>
                  {{ user.userType }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span v-if="user.isEnabled" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Enabled
                          </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Disabled
                          </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <router-link v-if="user.id" :to="`/admin/users/${user.id}/edit`" class="text-blue-600 hover:text-blue-900">Edit</router-link>
              </td>
            </tr>

            <!-- More people... -->
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <div class="py-6 px-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </a>
              <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </a>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ currentPage === 1 ? 1 : currentPage * 10 - 9 }}</span>
                  to
                  <span class="font-medium">{{ totalRecords < 10 ? totalRecords : (10 * currentPage) }}</span>
                  of
                  <span class="font-medium">{{ totalRecords }}</span>
                  results
                </p>
              </div>
              <div class="flex h-8 space-x-2">
                <div>
                  <label id="listbox-label" class="sr-only">
                    Change records count
                  </label>
                  <div class="relative">
                    <div ref="popcorn" class="inline-flex shadow-sm rounded-md divide-x divide-indigo-600 h-8">
                      <div class="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
                        <div class="relative inline-flex items-center bg-indigo-500 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white">
                          <p class="ml-2.5 text-xs sm:text-sm font-medium">
                            {{ filterForm.recordsPerPage }}
                          </p>
                        </div>
                        <button type="button" @click="pageCountOpen = !pageCountOpen" class="relative inline-flex items-center bg-indigo-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                          <span class="sr-only">Change records count</span>
                          <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <transition
                        ref="tooltip"
                        enter-active-class=""
                        leave-active-class="transition ease-in duration-100"
                        enter-class=""
                        enter-to-class=""
                        leave-class="opacity-100"
                        leave-to-class="opacity-0"
                    >
                      <ul v-show="pageCountOpen" class="origin-top-right absolute z-10 right-0 w-12 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-0">

                        <li v-for="(lot, i) in lots" :key="i" @click="choose(i)" @mouseenter="activeIndex = i" @mouseleave="activeIndex = null" :class="{ 'text-white bg-indigo-500': activeIndex === i, 'text-gray-900': !(activeIndex === i) }" class="cursor-pointer select-none relative p-4 text-sm" id="listbox-option-0" role="option">
                          <div class="flex flex-col">
                            <div class="flex justify-between">
                              <p :class="{ 'font-semibold': selectedIndex === i, 'font-normal': !(selectedIndex === i) }" class="font-normal text-xs sm:text-sm">
                                {{ lot }}
                              </p>
                            </div>
                          </div>
                        </li>

                      </ul>
                    </transition>
                  </div>
                </div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Previous</span>
                    <!-- Heroicon name: solid/chevron-left -->
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
                  <a v-for="(page, i) in totalPagesArray" :key="i" href="#" aria-current="page" :class="{'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': currentPage === page, 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' : currentPage !== page }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    {{ page }}
                  </a>

                  <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Next</span>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

</template>
