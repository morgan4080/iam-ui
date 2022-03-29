<script setup lang="ts">
  import {useRoute} from "vue-router"
  import {ref, computed} from "vue"
  import {getUser, getUsersRoles, passChange, passReset} from '@/modules/all'
  import { useStore } from "vuex"

  const route = useRoute()

  const store = useStore()

  const loading = ref(<boolean> false)

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
  getUser(route)
    .then((data) => {
      const { user } = data
      userData.value = {
        ...userData.value,
        ...user
      }
    }).catch((e: any) => {
      alert(e.message)
  })
  const form = ref(<any> {
    password: '',
    passwordConfirmation: ''
  })

  async function changePassword() {
    if (form.value.password !== form.value.passwordConfirmation) {
      await store.dispatch("defineNotification", { message: "Make Sure the Passwords are the same", error: true })
      return
    }
    loading.value = true
    try {
      const payload = {
        "userRefId": userData.value.id,
        "email": userData.value.email,
        "newPassword": form.value.password,
        "confirmPassword": form.value.passwordConfirmation
      }
      const response = await passChange(payload)
      console.log(response)
      await store.dispatch("defineNotification", { message: "Password Change Successful", success: true })
    } catch (e: any) {
      alert(e.message)
    } finally {
      loading.value = false
    }
  }
</script>
<template>

  <div class="w-full max-h-screen overflow-y-scroll">
    <form @submit.prevent="changePassword">
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="bg-white shadow sm:overflow-hidden">
            <nav class="mt-4 flex px-5" aria-label="Breadcrumb">
              <ol role="list" class="flex items-center space-x-4">

                <li>
                  <div class="flex items-center">
                    <router-link :to="`/admin/users/${route.params.id}`" class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate" style="color: #9e9e9e">User Profile</router-link>
                  </div>
                </li>

                <li>
                  <div class="flex items-center">
                    <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <h1 class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                      Change Password
                    </h1>
                  </div>
                </li>
              </ol>
            </nav>
            <div class="py-6 px-4 sm:p-5 sm:pt-3">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Change Password
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Provide a new password for user <span class="font-bold"> {{ userData.username }}</span>
                </p>
              </div>
              <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="email" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                   Email
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input disabled type="email" name="email" id="email" autocomplete="email" :value="userData.email" class="flex-1 bg-gray-50 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                    </div>
                  </div>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="password" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Password
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input v-model="form.password" type="password" name="password" id="password" autocomplete="password" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                    </div>
                  </div>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="password-confirmation" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Password Confirmation
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input v-model="form.passwordConfirmation" type="password" name="password-confirmation" id="password-confirmation" autocomplete="password-confirmation" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                    </div>
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
            <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Save: Password
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
