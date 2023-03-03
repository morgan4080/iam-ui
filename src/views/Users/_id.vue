<script setup lang="ts">
import {useRoute} from "vue-router"
import {ref, computed, onBeforeMount} from "vue"
import {getUser, getUsersRoles} from '@/modules/all'
import {useStore} from "vuex"
import {mapActions} from "@/modules/mapStore"
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {ChevronDownIcon} from '@heroicons/vue/20/solid'
import ResetCredentialsModal from "@/components/ResetCredentialsModal.vue";
import type {User} from "@/Users/types";

const {syncUser, userEnable, userDisable} = mapActions()

const route = useRoute()

const store = useStore()

const userData = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  isEnabled: '',
  keycloakId: '',
  phoneNumber: '',
  ussdPhoneNumber: '',
  tenantId: '',
  isUSSDDisabled: true,
  userAssignedRolesId: [],
  pinStatus: '',
  username: '',
  pinAttempts: 0
})

const userRoles = ref(<any[]>[])

const loading = ref(<boolean>false)

const resetCredentialModalOpen = ref(false)
const resetCredentialsAction = ref<'USSD' | 'WEB' | null>(null)

function openResetCredentialsModal() {
  resetCredentialModalOpen.value = true;
}
function closeResetCredentialsModal() {
  resetCredentialsAction.value = null
  resetCredentialModalOpen.value = false
}

const tenantId = computed(() => store.state.user ? store.state.user.tenantId : null)

const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

const fetchUserData = () => {
  getUser(route)
      .then((data) => {
        const {user} = data
        userData.value = {
          ...userData.value,
          ...user
        }
        console.log("user data value", userData.value)
        return user
      })
      .then((user: any) => {
        return getUsersRoles(user.keycloakId)
      })
      .then((roles: any) => {
        userRoles.value = roles.data
      })
      .catch((e: any) => {
        alert(e.message)
      })
}

function resetWebPassword() {
  resetCredentialsAction.value = 'WEB'
  openResetCredentialsModal()
}

function resetUSSDPin() {
  resetCredentialsAction.value = 'USSD'
  openResetCredentialsModal()
}

const synchronizeUser = async () => {
  try {
    loading.value = true
    const response = await syncUser(`${userData.value.id}`)
    console.log(response)
    loading.value = false
    await store.dispatch("defineNotification", {message: "User Account Synchronised", success: true})
  } catch (e: any) {
    await store.dispatch("defineNotification", {message: e.message, error: true})
  }
}

const enableUser = async () => {
  if (confirm(`You are about to enable user ${userData.value.firstName}`)) {
    loading.value = true
    try {
      const payload: { userRefId: string | any, isEnabled: boolean } = {
        "userRefId": route.params.id,
        "isEnabled": true
      }
      const response = await userEnable(payload)
      console.log(response)
      await store.dispatch("defineNotification", {message: "User Account Enabled", success: true})
      fetchUserData()
    } catch (e: any) {
      console.log("enableUser error", e)
      await store.dispatch("defineNotification", {message: "User Enable Error", error: true})
    } finally {
      loading.value = false
    }
  }
}

const disableUser = async () => {
  if (confirm(`You are about to disable user ${userData.value.firstName}`)) {
    loading.value = true
    try {
      const payload: { userRefId: string | any, isEnabled: boolean } = {
        "userRefId": route.params.id,
        "isEnabled": false
      }
      const response = await userDisable(payload)
      console.log(response)
      await store.dispatch("defineNotification", {message: "User Account Disabled", success: true})
      fetchUserData()
    } catch (e: any) {
      console.log("disableUser error", e)
      await store.dispatch("defineNotification", {message: "User Disable Error", error: true})
    } finally {
      loading.value = false
    }
  }
}

onBeforeMount(() => fetchUserData())

</script>

<template>
  <div class="w-full">
    <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
      <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
        <div class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200">
          <div class="flex-1 min-w-0">
            <div class="ml-3 flex items-center border-b border-gray-200">

              <nav class="flex space-x-4 items-center w-full" aria-label="Breadcrumb">
                <ol role="list" class="flex items-center space-x-4">

                  <li>
                    <div class="flex items-center">
                      <router-link to="/users"
                                   class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                                   style="color: #9e9e9e">Users
                      </router-link>
                    </div>
                  </li>

                  <li>
                    <div class="flex items-center">
                      <!-- Heroicon name: solid/chevron-right -->
                      <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"/>
                      </svg>
                      <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        User Profile
                      </h1>
                    </div>
                  </li>
                </ol>
                <button @click="synchronizeUser" type="button"
                        class="relative inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" :class="{ 'animate-spin': loading }" class="h-4 w-4"
                       viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clip-rule="evenodd"></path>
                  </svg>
                </button>
              </nav>
            </div>
            <div class="ml-3 mt-4 text-sm block ">
              <div class="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">
                    {{ userData.firstName + ' ' + userData.lastName }}
                    <span v-if="userData.isEnabled"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Enabled
                    </span>
                    <span v-else
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Disabled
                    </span>
                  </h1>
                  <p class="mt-2 text-sm text-gray-500">
                    <a href="#" class="font-medium text-gray-900 lowercase">{{ organisation }}</a>
                  </p>
                  <p class="mt-2 text-sm text-gray-900">
                    <span class="font-medium">Keycloak Id:</span>
                    <span>{{ userData.keycloakId }}</span>
                  </p>
                </div>
                <div class="mt-4 flex space-x-3 md:mt-0">
                  <Menu as="div" class="relative inline-block text-left">
                    <div>
                      <MenuButton
                          class="inline-flex justify-center items-center items-center px-3 py-2 border border-red-300 leading-4 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-0">
                        Reset Credentials
                        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
                      </MenuButton>
                    </div>

                    <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                      <MenuItems
                          class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="p-1">
                          <MenuItem v-slot="{ active }"
                                    class="rounded-md hover:text-red-700 hover:font-medium hover:bg-red-200">
                            <a @click.prevent="resetUSSDPin"
                               :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm hover:cursor-pointer']">
                              Reset USSD Pin
                            </a>
                          </MenuItem>
                          <MenuItem v-slot="{ active }"
                                    class="rounded-md hover:text-red-700 hover:font-medium hover:bg-red-200">
                            <a @click.prevent="resetWebPassword"
                               :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm hover:cursor-pointer']">
                              Reset Web Password
                            </a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>

                  <button @click="$router.push(`/users/${route.params.id}/assign-roles`)" type="button"
                          class="inline-flex justify-center items-center px-3 py-2 border border-green-300 leading-4 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Assign Roles
                    <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 -mr-0.5 h-4 w-4 text-green-400" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>

                  <Menu as="div" class="relative inline-block text-left">
                    <div>
                      <MenuButton
                          class="inline-flex justify-center items-center px-3 py-2 border border-teal-300 leading-4 shadow-sm text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-0">
                        Edit
                        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
                      </MenuButton>
                    </div>

                    <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                      <MenuItems
                          class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="p-1">
                          <MenuItem v-slot="{ active }"
                                    class="rounded-md hover:text-teal-700 hover:font-medium hover:bg-teal-100">
                            <router-link :to="`/profiles/${route.params.id}/edit`"
                                         :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                              Edit User
                            </router-link>
                          </MenuItem>
                          <MenuItem v-if="userData.isEnabled" v-slot="{ active }"
                                    class="rounded-md hover:text-red-700 hover:font-medium hover:bg-red-200">
                            <a @click.prevent="disableUser"
                               :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm hover:cursor-pointer']">
                              Disable User
                            </a>
                          </MenuItem>
                          <MenuItem v-else v-slot="{ active }"
                                    class="rounded-md hover:text-teal-700 hover:font-medium hover:bg-teal-100">
                            <a @click.prevent="enableUser"
                               :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm hover:cursor-pointer']">
                              Enable User
                            </a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
            </div>
            <div class="ml-3 mt-4 text-sm block">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    First name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ userData.firstName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Last name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ userData.lastName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ userData.username }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    USSD Phone No.
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ userData.ussdPhoneNumber }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    USSD Status
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ userData.isUSSDDisabled === true ? 'Disabled' : 'Enabled' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Contact Phone & Email
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <a class="underline text-blue-400" :href="`tel:userData.phoneNumber`">{{ userData.phoneNumber }}</a>
                    <br>
                    <a class="underline text-blue-400" :href="`mailto:userData.email `">{{ userData.email }}</a>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    User assigned roles
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <ul class="list-inside list-disc">
                      <li v-for="(role, i) in userRoles" :key="i">{{ role.name }}</li>
                    </ul>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    USSD Pin Status
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <a class="text-blue-400" href="#">Status: {{ userData.pinStatus }}</a>
                    <br>
                    <a class="text-blue-400" href="#">Remaining Attempts: {{ userData.pinAttempts }}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <ResetCredentialsModal
        v-if="resetCredentialsAction"
        :open="resetCredentialModalOpen"
        :action="resetCredentialsAction"
        :user="userData"
        @close="closeResetCredentialsModal"
    />
  </Teleport>
</template>
