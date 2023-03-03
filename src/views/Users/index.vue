<script setup lang="ts">
import { createPopper } from "@popperjs/core";
import { getUsers, syncUsers } from "@/modules/all";
import { ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { mapActions } from "@/modules/mapStore";

const { deleteUser, defineNotification } = mapActions();

const route = useRoute();
type userType = {
  isEnabled: boolean;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  ussdPhoneNumber: string;
  id: string;
  keycloakId?: string;
};

const allUsers = ref(<userType[]>[]);

const totalRecords = ref(<number>0);

const pageCountOpen = ref(<boolean>false);

const activeIndex = ref(<any>null);

const selectedIndex = ref(<any>null);

const lots = ref(<number[]>[10, 50, 100]);

const totalPages = ref(<number>0);

const currentPage = ref(<number>1);

const filterForm = reactive({
  recordsPerPage: 10,
  searchTerm: "",
  order: "ASC",
  page: currentPage.value,
});

const popcorn = ref(<any>null);
const tooltip = ref(<any>null);

watch(pageCountOpen, () => {
  console.log("pageCountOpen", pageCountOpen.value);
  if (pageCountOpen.value) {
    createPopper(popcorn.value, tooltip.value, {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [5, 10],
          },
        },
      ],
    });
  }
});

const choose = (index: number) => {
  selectedIndex.value = index;
  filterForm.recordsPerPage = lots.value[index];
  pageCountOpen.value = !pageCountOpen.value;
  refresh();
};

const loading = ref(<boolean>false);

const syncData = async () => {
  loading.value = true;
  await syncUsers();
  await refresh();
  loading.value = false;
};

const refresh = async () => {
  try {
    allUsers.value = [
      {
        isEnabled: true,
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        ussdPhoneNumber: "",
        id: "",
      },
    ];

    const query = ref(
      <string>(
        `?${
          filterForm.searchTerm !== ""
            ? "searchTerm=" + filterForm.searchTerm + "&"
            : ""
        }order=${filterForm.order}&sort=${filterForm.order}&pageSize=${
          filterForm.recordsPerPage
        }&pageIndex=${currentPage.value - 1}`
      )
    );
    console.log("query", query);
    const data: {
      totalRecords: number;
      totalPages: number;
      currentPage: number;
      records: {
        isEnabled: boolean;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        ussdPhoneNumber: string;
        id: string;
      }[];
    } = await getUsers(query.value);

    console.log("all users", data);
    totalRecords.value = data.totalRecords;
    totalPages.value = data.totalPages;
    currentPage.value = data.currentPage + 1;
    allUsers.value = data.records;
  } catch (e: any) {
    alert(e.message);
  }
};

const changePage = (act: string): void => {
  if (act === "add") {
    currentPage.value = currentPage.value + 1;
    refresh();
  }
  if (act === "subtract") {
    currentPage.value = currentPage.value - 1;
    refresh();
  }
};

const deleteUsers = async (theUser: userType) => {
  // deleteUser
  if (
    confirm(
      `Are you sure you want to delete ${theUser.firstName} ${theUser.lastName}`
    )
  ) {
    try {
      loading.value = true;
      const response = await deleteUser(theUser.keycloakId);
      console.log("API response deleteUsers", response);
      defineNotification({
        message: "User deleted successfully",
        success: true,
      });
    } catch (e: any) {
      console.log("API error deleteUsers", e);
      defineNotification({
        message: `API error deleteUsers: ${e}`,
        error: true,
      });
    } finally {
      loading.value = false;
      await refresh();
    }
  }
};

refresh();
</script>

<template>
  <div class="w-full bg-white max-h-screen overflow-y-scroll pb-32">
    <div class="pb-24 sm:px-6 lg:px-0 lg:col-span-9">
      <section>
        <div class="py-6 px-4 sm:p-6 flex flex-wrap items-center justify-start">
          <button
            @click="$router.push('/users/create')"
            type="button"
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            Add user
          </button>
          <div class="relative flex-none z-0 inline-flex rounded-md ml-auto">
            <div class="relative h-8 rounded-md mr-2 shadow-sm">
              <div class="absolute inset-y-0 left-0 flex items-center">
                <label
                  for="filter"
                  class="sr-only"
                  >Filter</label
                >
                <select
                  @change="refresh()"
                  v-model="filterForm.order"
                  id="filter"
                  class="h-full py-0 pl-4 pr-6 border-transparent bg-transparent text-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md text-sm"
                >
                  <option value="ASC">ASC</option>
                  <option value="DESC">DESC</option>
                </select>
              </div>
              <input
                @change="refresh()"
                v-model="filterForm.searchTerm"
                type="search"
                id="search"
                class="px-4 py-1 h-full block w-full pl-20 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-sm"
                placeholder="search term..."
              />
            </div>
            <button
              @click="syncData"
              type="button"
              class="shadow-sm relative inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :class="{ 'animate-spin': loading }"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section>
        <div class="pb-6 px-4">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  USSD
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Web Access
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  USSD Access
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-if="allUsers.length > 0"
                v-for="user in allUsers"
                :key="user.id"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  <router-link :to="`/users/${user.id}`">
                    <span
                      v-if="user.firstName === '' && user.lastName === ''"
                      class="h-4 w-12 bg-gray-400 block rounded animate-pulse"
                    ></span>
                    {{ user.firstName }} {{ user.lastName }}
                  </router-link>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 lowercase"
                >
                  <router-link :to="`/users/${user.id}`">
                    <span
                      v-if="user.username === ''"
                      class="h-4 w-8 bg-gray-400 block rounded animate-pulse"
                    ></span>
                    {{ user.username }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <router-link :to="`/users/${user.id}`">
                    <span
                      v-if="user.phoneNumber === ''"
                      class="h-4 w-12 bg-gray-400 block rounded animate-pulse"
                    ></span>
                    {{ user.ussdPhoneNumber ? user.ussdPhoneNumber : "" }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <router-link :to="`/users/${user.id}`">
                    <span
                      v-if="user.email === ''"
                      class="h-4 w-12 bg-gray-400 block rounded animate-pulse"
                    ></span>
                    <span v-else>Yes</span>
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <router-link :to="`/users/${user.id}`">
                    <span
                      v-if="user.email === ''"
                      class="h-4 w-12 bg-gray-400 block rounded animate-pulse"
                    ></span>
                    <span v-else>{{
                      user.ussdPhoneNumber ? "Yes" : "No"
                    }}</span>
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    v-if="user.isEnabled"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    Enabled
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    Disabled
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-4"
                >
                  <router-link
                    v-if="user.id"
                    :to="`/users/${user.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </router-link>
                  <button
                    @click="deleteUsers(user)"
                    type="button"
                    class="text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  No Data Available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <div class="py-6 px-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{
                    currentPage === 1
                      ? 1
                      : (currentPage - 1) * filterForm.recordsPerPage + 1
                  }}</span>
                  to
                  <span class="font-medium">{{
                    currentPage === 1
                      ? filterForm.recordsPerPage
                      : currentPage * filterForm.recordsPerPage
                  }}</span>
                  of
                  <span class="font-medium">{{ totalRecords }}</span>
                  results
                </p>
              </div>
              <div class="flex h-8 space-x-2">
                <div>
                  <label
                    id="listbox-label"
                    class="sr-only"
                  >
                    Change records count
                  </label>
                  <div class="relative">
                    <div
                      ref="popcorn"
                      class="inline-flex shadow-sm rounded-md divide-x divide-blue-600 h-8"
                    >
                      <div
                        class="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-blue-600"
                      >
                        <div
                          class="relative inline-flex items-center bg-blue-500 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white"
                        >
                          <p class="ml-2.5 text-xs sm:text-sm font-medium">
                            {{ filterForm.recordsPerPage }}
                          </p>
                        </div>
                        <button
                          type="button"
                          @click="pageCountOpen = !pageCountOpen"
                          class="relative inline-flex items-center bg-blue-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                          aria-haspopup="listbox"
                          aria-expanded="true"
                          aria-labelledby="listbox-label"
                        >
                          <span class="sr-only">Change records count</span>
                          <svg
                            class="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
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
                      <ul
                        v-show="pageCountOpen"
                        class="origin-top-right absolute z-10 right-0 w-12 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
                        tabindex="-1"
                        role="listbox"
                        aria-labelledby="listbox-label"
                        aria-activedescendant="listbox-option-0"
                      >
                        <li
                          v-for="(lot, i) in lots"
                          :key="i"
                          @click="choose(i)"
                          @mouseenter="activeIndex = i"
                          @mouseleave="activeIndex = null"
                          :class="{
                            'text-white bg-indigo-500': activeIndex === i,
                            'text-gray-900': !(activeIndex === i),
                          }"
                          class="cursor-pointer select-none relative p-4 text-sm"
                          id="listbox-option-0"
                          role="option"
                        >
                          <div class="flex flex-col">
                            <div class="flex justify-between">
                              <p
                                :class="{
                                  'font-semibold': selectedIndex === i,
                                  'font-normal': !(selectedIndex === i),
                                }"
                                class="font-normal text-xs sm:text-sm"
                              >
                                {{ lot }}
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </transition>
                  </div>
                </div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    @click="!(currentPage <= 1) ? changePage('subtract') : null"
                    type="button"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Previous</span>
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <div
                    :class="{
                      'z-10 bg-indigo-50 border-indigo-500 text-indigo-600':
                        currentPage === filterForm.page,
                      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50':
                        currentPage !== filterForm.page,
                    }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ currentPage }}
                  </div>
                  <button
                    @click="
                      !(currentPage > totalPages) ? changePage('add') : null
                    "
                    type="button"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Next</span>
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
