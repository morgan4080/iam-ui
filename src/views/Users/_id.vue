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
    pinStatus: '',
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

            <nav class="flex" aria-label="Breadcrumb">
              <ol role="list" class="flex items-center space-x-4">

                <li>
                  <div class="flex items-center">
                    <router-link to="/admin/users" class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate" style="color: #9e9e9e">Users</router-link>
                  </div>
                </li>

                <li>
                  <div class="flex items-center">
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                      User Profile
                    </h1>
                  </div>
                </li>
              </ol>
            </nav>
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
                  <a href="#" class="font-medium text-gray-900 lowercase">{{ organisation }}</a>
                </p>
              </div>
              <div class="mt-4 flex space-x-3 md:mt-0">
                <button @click="$router.push(`/admin/profiles/${route.params.id}/edit`)" type="button" class="inline-flex justify-center px-3 py-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Edit User
                  <svg class="ml-2 -mr-0.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button @click="$router.push(`/admin/users/${route.params.id}/assign-roles`)" type="button" class="inline-flex justify-center px-4 py-3 border border-green-300 leading-4 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Assign Roles
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 -mr-0.5 h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button v-if="userData.pinStatus === 'NOT_SET'" @click="$router.push(`/admin/users/${route.params.id}/change-password`)" type="button" class="inline-flex justify-center px-4 py-3 border border-indigo-300 leading-4 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Change Password
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 -mr-0.5 h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </button>
                <button @click="$router.push(`/admin/users/${route.params.id}/change-pin`)" type="button" class="inline-flex justify-center px-4 py-3 border border-teal-300 leading-4 shadow-sm text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  Change Pin
                  <svg class="ml-2 -mr-0.5 h-4 w-4 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg>
                </button>
                <button @click="doPasswordReset" type="button" class="inline-flex justify-center px-4 py-3 border border-amber-300 leading-4 shadow-sm text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  Reset Password
                  <svg class="ml-2 -mr-0.5 h-4 w-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </button>
<!--                <button type="button" class="group inline-flex justify-center px-4 py-3 border border-red-300 leading-4 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Disable
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 -mr-0.5 h-4 w-4 text-red-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>-->
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
