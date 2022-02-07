<script setup lang="ts">
  import {useRoute} from "vue-router"
  import {computed, reactive, ref} from "vue"
  import {getRoles, getUser, editTheUser} from '@/modules/all'
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

  getUser(route).then((data) => {
      // User
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

  getRoles()
      .then((roles: any) => {
        console.log("all roles", roles)
        all_roles.value = roles.records
      })
      .catch((e: any) => {
        alert(e.message)
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


    loading.value = true

    const userType: string = userData.value.userType.toLowerCase()

    let payload: {} = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.emailAddress,
      phoneNumber: form.phoneNumber
    }

    console.log("submit data", payload)

    editTheUser(userType, payload, route).then((response: any) => {
      console.log("edit response", response)
    }).catch((e: any) => {
      alert(e.message)
    }).finally(() => {
      loading.value = false
    })

  }
</script>

<template>
  <div class="w-full bg-white">
    <div class="flex-col h-screen w-full overflow-y-auto pb-28" style="min-height: 640px;">
      <div class="px-4 pb-6 sm:px-6 lg:mx-auto lg:px-8">
        <form @submit.prevent="editUser" method="POST">
          <div class="py-3 md:flex md:flex-col md:justify-between">

            <div class="flex-1 min-w-0">
              <div class="text-xl font-semibold leading-7 text-gray-900 py-2 sm:leading-9 sm:truncate border-b border-gray-200">
                <router-link :to="`/admin/profiles/${route.params.id}`" class="text-teal-500 capitalize text-xl">
                  {{ userData.firstName + ' ' + userData.lastName }} /
                </router-link>
                &nbsp;User edit
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
                          <input v-model="form.emailAddress" type="email" name="email" id="email" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
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
                            <select id="phone" class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                              <option>KE</option>
                            </select>
                          </div>
                          <input type="text" id="phone-number" v-model="form.phoneNumber" class="py-1 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" required>
                        </div>
                      </div>
                    </div>
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="phone-number" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Assign Roles
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg relative">
                          <dl class="space-y-3 divide-y divide-gray-200">
                            <div class="pt-5" v-for="(role, i) in all_roles">
                              <dt class="relative flex items-start">
                                <div class="flex items-center h-5">
                                  <input :id="`role${i}}`" @change="setEventVal" :value="role" :name="'role' + i" aria-describedby="roles-description" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                </div>
                                <div class="ml-3 text-sm">
                                  <label :for="`role${i}}`" class="font-medium text-gray-700">{{ role.name }}</label>
                                  <p id="comments-description" class="text-gray-500">{{ role.description }}</p>
                                </div>
                              </dt>
                            </div>
                          </dl>
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
