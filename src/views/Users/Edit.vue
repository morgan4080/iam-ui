<script setup lang="ts">
import {useRoute, useRouter} from "vue-router"
  import {computed, reactive, ref} from "vue"
  import {getRoles, getUser, editTheUser} from '@/modules/all'
  import {useStore} from "vuex"
  const router = useRouter()

  const store = useStore()

  const route = useRoute()

  interface User {
    id: string,
    keycloakId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    tenantId: string,
    userAssignedRolesId: any[],
    userType: string,
    username: string
  }

  const form = reactive({
    username: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    company: <any>'',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
    pinSecret: '',
    pinSecretConfirmation: '',
    user_roles: <any>[]
  })

  const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

  let arrayFocus: {
    id: number,
    name: string,
    permissions: string,
    description: string
  }[] = []

  const userData = ref(<User>{
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })

  getUser(route).then((data) => {
      // User
    console.log("user data", data)
    const { user } = data
    userData.value = {
      ...userData.value,
      ...user
    }
    form.firstName = user.firstName
    form.lastName = user.lastName
    form.emailAddress = user.email
    form.username = user.username
    form.phoneNumber = user.phoneNumber
    form.company = organisation
  }).catch((e: any) => {
    alert(e.message)
  })

  const loading = ref(false)

  function editUser () {
    loading.value = true
    let payload: { userRefId: string, firstName: string, lastName: string, email: string | undefined, phoneNumber: string | undefined, isEnabled: boolean } = {
      userRefId: userData.value.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.emailAddress,
      phoneNumber: form.phoneNumber,
      isEnabled: true
    }

    if (form.emailAddress === '') {
      delete payload.email
    }
    if (form.phoneNumber === '') {
      delete payload.phoneNumber
    }

    store.dispatch("editTheUser", { payload, route }).then(async (response: any) => {
      console.log("edit response", response)
      await store.dispatch("defineNotification", { message: `User Edited successfully`, success: true })
      await router.push(`/admin/users/${route.params.id}`)
    }).catch((e: any) => {
      alert(e.message)
    }).finally(async () => {
      loading.value = false
      await router.push(`/admin/users/${route.params.id}`)
    })

  }
</script>

<template>
  <div class="w-full bg-white">
    <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
      <div class="px-4 pb-6 sm:px-6 lg:mx-auto lg:px-8">
        <div class="pt-3 flex items-center">
          <nav class="flex" aria-label="Breadcrumb">
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
                    Edit User
                  </h1>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <form @submit.prevent="editUser" method="POST">
          <div class="md:flex md:flex-col md:justify-between">

            <div class="flex-1 min-w-0">
              <div class="text-xl font-semibold leading-7 text-gray-900 py-2 sm:leading-9 sm:truncate border-b border-gray-200">
                {{ userData.firstName + ' ' + userData.lastName }}
              </div>
              <div class="py-3 md:flex md:justify-between">
                <div class="text-sm block w-full">

                  <div class="space-y-2">
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="first-name" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        First Name
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input v-model="form.firstName" type="text" name="first-name" id="first-name" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                        </div>
                      </div>
                    </div>
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="last-name" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Last Name
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input v-model="form.lastName" type="text" name="last-name" id="last-name" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                        </div>
                      </div>
                    </div>
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="email" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Email
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input v-model="form.emailAddress" type="email" name="email" id="email" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" >
                        </div>
                      </div>
                    </div>
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="phone-number" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Phone number
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 flex items-center">
                            <label for="country" class="sr-only">Country</label>
                            <select id="country" class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                              <option>KE</option>
                            </select>
                          </div>
                          <input type="text" id="phone-number" v-model="form.phoneNumber" class="py-1 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex w-full">
            <button type="submit" :disabled="loading" class="inline-flex mt-4 ml-auto items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
              <svg v-if="loading" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Save user
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
