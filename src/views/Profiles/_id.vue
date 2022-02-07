<script setup lang="ts">
  import {useRoute} from "vue-router"
  import {ref, computed} from "vue"
  import {getUser, getUsersRoles, passReset} from '@/modules/all'
  import { useStore } from "vuex"

  const route = useRoute()

  const store = useStore()

  const userData = ref({
    firstName: '',
    lastName: '',
    email: '',
    id: '',
    isEnabled: '',
    keycloakId: '',
    phoneNumber: '',
    tenantId: '',
    userAssignedRolesId: [],
    userType: '',
    username: ''
  })

  const userRoles = ref(<any[]>[])

  getUser(route)
    .then((data) => {
      const { user } = data
      userData.value = {
        ...userData.value,
        ...user
      }
      console.log(userData.value)
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

  const tenantId = computed(() => store.state.user ? store.state.user.tenantId : null)

  async function doPasswordReset () {
    confirm("You are about to send password reset email to: " + userData.value.email)
    const payload = {
        "username": userData.value.username,
        "userRefId": userData.value.keycloakId,
        "tenantId": tenantId.value
    }

    try {
      const response = await passReset(payload)
      console.log("password reset", response)
      await store.dispatch("defineNotification", { message: "Password Reset Email Sent", success: true })
    } catch (e: any) {
      alert(e.message)
    }
  }

  const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

</script>

<template>
<div class="w-full">
  <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
    <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
      <div class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200">
        <div class="flex-1 min-w-0">
          <div class="ml-3 flex items-center border-b border-gray-200">
            <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
              User Profile
            </h1>
          </div>
          <div class="ml-3 mt-4 text-sm block ">
            <div class="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ userData.firstName + ' ' + userData.lastName }}
                  <span v-if="userData.isEnabled" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Enabled
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Disabled
                  </span>
                </h1>
                <p class="mt-2 text-sm text-gray-500">
                  User type
                  <a href="#" class="font-medium text-gray-900 lowercase underline">{{ userData.userType }}</a>
                  of
                  <a href="#" class="font-medium text-gray-900 lowercase">{{ organisation }}</a>
                </p>
              </div>
              <div class="mt-4 flex space-x-3 md:mt-0">
                <button @click="$router.push(`/admin/profiles/${route.params.id}/edit`)" type="button" class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit User</span>
                </button>
                <button v-if="userData.userType === 'ADMIN'" @click="$router.push(`/admin/users/${route.params.id}/change-password`)" type="button" class="inline-flex justify-center px-4 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Change Password</span>
                </button>
                <button v-if="userData.userType === 'CUSTOMER'" @click="$router.push(`/admin/users/${route.params.id}/change-pin`)" type="button" class="inline-flex justify-center px-4 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Change Pin</span>
                </button>
                <button @click="doPasswordReset" type="button" class="inline-flex justify-center px-4 py-2 border border-amber-300 shadow-sm text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Reset Password</span>
                </button>
                <button type="button" class="group inline-flex justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-red-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <span>Disable</span>
                </button>
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
                  Phone number
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ userData.phoneNumber }}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ userData.email }}
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
                  User assigned roles
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <ul class="list-inside list-disc">
                    <li v-for="(role, i) in userRoles" :key="i">{{ role.name }}</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
