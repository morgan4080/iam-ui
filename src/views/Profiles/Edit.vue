<script setup lang="ts">
  import {useRoute} from "vue-router"
  import {computed, reactive, ref} from "vue"
  import {getAccessToken, getRoles, getUser, editTheUser} from '@/modules/all'
  import {useStore} from "vuex"

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

  const all_roles = ref(<any[]>[])

  getAccessToken()
  .then(async (token?: string) => {
    try {

      const user: User = await getUser(route, token)
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
    } catch (e) {
      throw e
    }
    try {
      all_roles.value = await getRoles(token)
    } catch (e) {
      throw e
    }
  }).catch((e: any) => {
    console.log(e)
    alert("Check Console")
  })

  const rolesExpanded =  ref(<boolean>false)

  function expandRoles() {
    rolesExpanded.value = !rolesExpanded.value
  }

  function setEventVal(event: any) {
    if (event.target.checked) {
      arrayFocus.push(event.target._value)
    } else {
      if (arrayFocus.length > 0) {
        console.log(arrayFocus.indexOf(event.target._value))
        const index = arrayFocus.indexOf(event.target._value)
        if (index !== -1) {
          delete arrayFocus[index];
        }
      }
    }
    let filtered: any = []
    for (let i = 0; i < arrayFocus.length; i++) {
      if (arrayFocus[i]) {
        filtered.push(arrayFocus[i])
      }
    }
    form.user_roles = filtered
    console.log(form.user_roles)
  }

  const loading = ref(false)

  function editUser () {
    let payload: {}

    loading.value = true

    const userType: string = userData.value.userType.toLowerCase()

    if (userType === 'admin') {
      payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.emailAddress,
        username: form.username,
        password: form.password,
        phoneNumber: form.phoneNumber,
        userRoles: form.user_roles.map((role: any) => role.roleName),
        userRoleIds: form.user_roles.map((role: any) => role.id),
        tenantId: userData.value.tenantId,
        enabled: true
      }
    }

    else {
      payload = {
        phoneNumber: form.phoneNumber,
        username: form.username,
        emailAddress: form.emailAddress,
        firstName: form.firstName,
        lastName: form.lastName,
        isEnabled: true,
        pinSecret: form.pinSecret,
        customerId: userData.value.id
      }
    }

    console.log("submit data", payload)

    getAccessToken()
    .then(async (token?: string) => {
      try {
        const response: any = await editTheUser(userType, payload, route, token)
        console.log("edit response", response)
      } catch (e) {
        throw e
      }
    }).catch((e: any) => {
      console.log(e)
      alert("Check Console")
    }).finally(() => {
      loading.value = false
    })
  }
</script>

<template>
  <div class="w-full">
    <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
      <div class="px-4 pb-6 sm:px-6 lg:mx-auto lg:px-8">
        <form @submit.prevent="editUser" method="POST">
          <div class="py-3 md:flex md:flex-col md:justify-between">

            <div class="flex-1 min-w-0">
              <div class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate border-b border-gray-200">
                <router-link :to="`/admin/profiles/${route.params.id}`" class="text-teal-500 capitalize">
                  {{ userData.firstName + ' ' + userData.lastName }} /
                </router-link>
                &nbsp;Profile edit
              </div>
              <div class="py-3 md:flex md:justify-between">
                <div class="mt-4 text-sm block w-full">

                  <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                      <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                      <div class="mt-1">
                        <input v-model="form.firstName" type="text" id="first-name" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="John">
                      </div>
                    </div>
                    <div>
                      <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                      <div class="mt-1">
                        <input v-model="form.lastName" type="text" id="last-name" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="Doe">
                      </div>
                    </div>
                    <div class="sm:col-span-2">
                      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                      <div class="mt-1">
                        <input v-model="form.emailAddress" id="email" type="email" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                      </div>
                    </div>
                    <div class="sm:col-span-2">
                      <label for="phone-number" class="block text-sm font-medium text-gray-700">Phone Number</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 flex items-center">
                          <label for="country" class="sr-only">Country</label>
                          <select id="country" class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                            <option>KE</option>
                          </select>
                        </div>
                        <input v-model="form.phoneNumber" type="text" id="phone-number" class="py-3 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="254722000654">
                      </div>
                    </div>
                    <div v-if="userData.userType ? userData.userType.toLowerCase() !== 'customer' : false">
                      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                      <div class="mt-1">
                        <input v-model="form.password" id="password" type="password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                      </div>
                    </div>
                    <div v-if="userData.userType ? userData.userType.toLowerCase() !== 'customer' : false">
                      <label for="password-confirmation" class="block text-sm font-medium text-gray-700">Password confirmation</label>
                      <div class="mt-1">
                        <input v-model="form.passwordConfirmation" id="password-confirmation" type="password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                      </div>
                    </div>
                    <div v-if="userData.userType ? userData.userType.toLowerCase() === 'customer' : false">
                      <label for="pinSecret" class="block text-sm font-medium text-gray-700">Pin secret</label>
                      <div class="mt-1">
                        <input v-model="form.pinSecret" id="pinSecret" type="password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                      </div>
                    </div>
                    <div v-if="userData.userType ? userData.userType.toLowerCase() === 'customer' : false">
                      <label for="pinSecretConfirmation" class="block text-sm font-medium text-gray-700">Pin secret confirmation</label>
                      <div class="mt-1">
                        <input v-model="form.pinSecretConfirmation" id="pinSecretConfirmation" type="password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div v-if="userData.userType ? userData.userType.toLowerCase() !== 'customer' : false" class="flex-1 min-w-0 pt-6 sm:pt-0">
              <button type="button" @click="expandRoles" class="flex items-center">
                <span class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate">Change roles</span>
                <span class="ml-6 h-7 flex items-center">
                  <svg :class="{ 'rotate-0': !rolesExpanded, '-rotate-180': rolesExpanded }" class="h-6 w-6 transform text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div v-if="rolesExpanded">
                <dl class="space-y-6 divide-y divide-gray-200">
                  <div class="pt-5" v-for="(role, i) in all_roles">
                    <dt class="text-base">
                      <label :for="'role' + i" type="button" class="text-left w-full flex justify-between items-start text-gray-400" aria-controls="faq-0" aria-expanded="false">
                        <span class="font-medium text-gray-900 flex items-center space-x-2">
                          <input :id="'role'+i" @change="setEventVal" :value="role" :name="'role' + i" class="border-gray-400 rounded-md" type="checkbox">
                          <span>{{ role.roleName }}</span>
                        </span>
                      </label>
                    </dt>
                  </div>
                </dl>
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
