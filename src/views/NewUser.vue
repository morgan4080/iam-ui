<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {ref, reactive, computed} from "vue"
import {getAccessToken, getPermissions, getRoles, postUser} from "@/modules/all"
import { useStore } from "vuex"

const store = useStore()

const tenantId = computed(() => store.state.user ? store.state.user.tenantId : null)

const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

const available_roles = ref(<{roleName: string, roleType: string, keycloakRoleId: string, roleDescription: string, id: string }[]>[])

const available_permissions = ref(<any[]>[])

getAccessToken()
    .then(async (token?: string) => {
      try {
        available_roles.value = await getRoles(token)
      } catch (e) {
        throw e
      }
      try {
        available_permissions.value = await getPermissions(token)
      } catch (e) {
        throw e
      }
    }).catch((e: any) => {
      console.log(e)
      alert("Check Console")
    })

const formStep1 = reactive({
  firstName: null,
  lastName: null,
  username: null,
  email: null,
  password: null,
  passwordConfirmation: null,
  pinSecret: null,
  pinSecretConfirmation: null,
  phoneNumber: null,
  user_type: null,
  access_type: null,
  tenantId: null,
  enabled: true
})

const formStep2: {user_has_roles: any, user_roles: any} = reactive({
  user_has_roles: null,
  user_roles: null
})

const rulesStep1 = {
  username: { required },
  user_type: { required },
  access_type: { required },
  firstName: { required },
  lastName: { required },
  email: { required },
  password: { required },
  passwordConfirmation: { required },
  phoneNumber: { required },
  pinSecret: { required },
  pinSecretConfirmation: { required },
  tenantId: { required },
}

const rulesStep2 = {
  user_has_roles:{ required },
  user_roles: { required }
}

const vuelidateStep1 = useVuelidate(rulesStep1, formStep1)

const vuelidateStep2 = useVuelidate(rulesStep2, formStep2)

const currentStep = ref(1)

const steps = ref([
  {
    stage: 1,
    state: 'Current'
  },
  {
    stage: 2,
    state: 'Upcoming'
  },
  {
    stage: 3,
    state: 'Upcoming'
  },
  {
    stage: 4,
    state: 'Upcoming'
  }
])

const errorUsername = ref(false)

const errorUserType = ref(false)

const errorUserHasRoles = ref(false)

const errorUserRoles = ref(false)

async function validate(current: number, stepInput: number) {
  const userType: any = formStep1.user_type

  if (current === 1) {
    vuelidateStep1.value.username.$touch()
    vuelidateStep1.value.user_type.$touch()
    const result = await vuelidateStep1.value.username.$validate()
    const result0 = await vuelidateStep1.value.user_type.$validate()

    if (!result) {
      errorUsername.value = true
    }
    if (!result0) {
      errorUserType.value = true
    }
    if (!result && !result0) {
      return
    }

    if (userType === "customer") {
      launchSpecific(steps.value[steps.value.length - 2].stage)
    } else {
      launchSpecific(stepInput)
    }
  }

  if (current === 2) {
    vuelidateStep2.value.user_has_roles.$touch()
    vuelidateStep2.value.user_roles.$touch()
    const result00 = await vuelidateStep2.value.user_has_roles.$validate()
    const result01 = await vuelidateStep2.value.user_roles.$validate()

    if (!result00) {
      errorUserHasRoles.value = true
    }
    if (!result01) {
      errorUserRoles.value = true
    }
    if (!result00 && !result01) {
      return
    }
    if (userType === "customer") {
      launchSpecific(steps.value[steps.value.length - 2].stage)
    } else {
      launchSpecific(stepInput)
    }
  }

  /*
  console.log("validation rules step 1", vuelidateStep1.value)
  console.log("validation rules step 2", vuelidateStep2.value)*/
}

function launchSpecific(stepInput: number) {
  if (stepInput) {
    console.log(stepInput)
    if (stepInput < currentStep.value) {
      console.log("going back")
      steps.value.map(step => {
        if (step.stage === stepInput) {
          step.state = 'Current'
        } else {
          if (step.stage > stepInput) {
            step.state = 'Upcoming'
          }
        }
      })
      currentStep.value = stepInput
    } else {
      currentStep.value = stepInput
      steps.value.map(step => {
        if (step.stage === currentStep.value - 1) {
          step.state = 'Completed'
        }
        if (step.state === 'Upcoming' && currentStep.value === step.stage) {
          step.state = 'Current'
        }
        if (step.state === 'Completed' && step.stage === currentStep.value) {
          step.state = 'Current'
        }
      })
    }
  }
}

let arrayFocus: {
  id: number,
  name: string,
  permissions: string,
  description: string
}[] = []

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
  formStep2.user_roles = filtered
  if (filtered.length > 0) {
    errorUserRoles.value = false
  }
}

const loading = ref(false)

const responseData = ref(<{}>{})

function createUser() {
  loading.value = true
  console.log(formStep1)
  console.log(formStep2)

  // upload to server

  const userType: any = formStep1.user_type

  const payload: any = (userType === 'admin') ?  {
    "userType": userType,
    "firstName": formStep1.firstName,
    "lastName": formStep1.lastName,
    "password": formStep1.password,
    "phoneNumber": formStep1.phoneNumber,
    "email": formStep1.email,
    "username": formStep1.username,
    "userRoles": formStep2.user_roles.map((role: {roleName: string}) => role.roleName),
    "userRoleIds": formStep2.user_roles.map((role: {id: string}) => role.id),
    "tenantId": tenantId.value,
    "enabled": true
  } : (userType === 'customer') ? {
    "userType": userType,
    "firstName": formStep1.firstName,
    "lastName": formStep1.lastName,
    "pinSecret": formStep1.pinSecret,
    "username": formStep1.username,
    "password": formStep1.pinSecret,
    "phoneNumber": formStep1.phoneNumber,
    "emailAddress": formStep1.email
  } : null ;

  getAccessToken()
  .then(async (token?: string) => {
    try {
      const response: any = await postUser(payload, token)
      console.log("create user response", response)
      // move to final stage
      responseData.value = response
      launchSpecific(4)
    } catch (e) {
      throw e
    }
  }).catch((e: any) => {
    console.log(e)
    alert("check console")
  }).finally(() => {
    loading.value = false
  })
}

function checkUserTypeAccessType() {
  if (!formStep1.access_type) return true
  return !formStep1.user_type;
}

function download_csv_file(accountData: any[]) {
  let csv = 'Username,Password\n'

  accountData.forEach(function(row: any) {
    csv += row.join(',')
    csv += "\n"
  })

  const hiddenElement = document.createElement('a')
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
  hiddenElement.target = '_blank'

  hiddenElement.download = organisation.value + ' Credentials.csv'
  hiddenElement.click()
}

</script>

<template>
  <div class="flex-col h-screen w-full pb-12 overflow-y-auto" style="min-height: 640px;">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-3 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div class="flex-1 min-w-0">
          <div class="flex flex-col">
            <div class="flex flex-row justify-between">
              <div>
                <h3 v-if="currentStep !== 4" class="text-lg font-bold tracking-tight text-gray-900">Add User</h3>
                <h3 v-else class="text-lg font-bold tracking-tight text-gray-900">User Created</h3>
              </div>
              <nav class="flex items-center justify-center" aria-label="Progress">
                <p class="text-sm font-medium text-gray-700">Step 1 of 4</p>
                <ol role="list" class="ml-8 flex items-center space-x-5">
                  <li v-for="(step, i) in steps" :key="i">
                    <!-- Completed Step -->
                    <a @click="launchSpecific(step.stage)" v-if="step.state === 'Completed'" href="#" class="block w-2.5 h-2.5 bg-indigo-600 rounded-full hover:bg-indigo-900">
                      <span class="sr-only">Step {{ step.stage }}</span>
                    </a>

                    <!-- Current Step -->
                    <a @click="launchSpecific(step.stage)" v-if="step.state === 'Current'" href="#" class="relative flex items-center justify-center" aria-current="step">
                      <span class="absolute w-5 h-5 p-px flex" aria-hidden="true">
                        <span class="w-full h-full rounded-full bg-indigo-200"></span>
                      </span>
                      <span class="relative block w-2.5 h-2.5 bg-indigo-600 rounded-full" aria-hidden="true"></span>
                      <span class="sr-only">Step {{ step.stage }}</span>
                    </a>

                    <!-- Upcoming Step -->
                    <a @click="launchSpecific(step.stage)" v-if="step.state === 'Upcoming'" href="#" class="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400">
                      <span class="sr-only">Step {{ step.stage }}</span>
                    </a>
                  </li>
                </ol>
              </nav>
            </div>

            <transition
                enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                enter-class="transform opacity-0 translate-x-full"
                enter-to-class="transform opacity-100 translate-x-0"
                leave-class="transform opacity-100 translate-x-0"
                leave-to-class="transform opacity-0 translate-x-full"
            >
              <div v-if="currentStep === 1" class="flex flex-col min-h-screen">
                <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 border-b pb-8">
                  <div class="flex flex-col col-span-1">
                    <div class="flex flex-row justify-between pt-5 border-b pb-2">
                      <div class="font-medium text-lg text-gray-700">
                        <h3>Set user type</h3>
                      </div>
                    </div>
                    <div class="flex text-sm text-gray-500 pt-1">
                      <p>Select how these users will access lending services. Mobile USSD or Web</p>
                    </div>
                    <div class="flex flex-row items-center pt-5 pb-20 w-full">
                      <div class="flex flex-col items-start mx-auto">
                        <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 w-full">
                          <div class="col-span-1 flex flex-row items-center space-x-3">
                            <input @focus="errorUserType = false" id="admin" v-model="formStep1.user_type" value="admin" name="user_type" class="border-gray-400 rounded-md" type="radio">
                            <label for="admin" class="text-base text-gray-700 flex flex-col">
                              <span class="font-semibold">Admin user</span>
                              <span class="font-medium text-sm text-gray-500">Create admin user</span>
                            </label>
                          </div>

                          <div class="col-span-1 flex flex-row items-center space-x-3">
                            <input @focus="errorUserType = false" id="customer" v-model="formStep1.user_type" value="customer" name="user_type" class="border-gray-400 rounded-md" type="radio">
                            <label for="customer" class="text-base text-gray-700 flex flex-col">
                              <span class="font-semibold">Customer user</span>
                              <span class="font-medium text-sm text-gray-500">Create customer account</span>
                            </label>
                          </div>

                        </div>

                        <div class="flex flex-row justify-between pt-8 border-b pb-2">
                          <div class="font-medium text-lg text-gray-700">
                            <h3>Set access type</h3>
                          </div>
                        </div>
                        <div class="flex text-sm text-gray-500 pt-1">
                          <p>Select how these users will access lending services. Mobile USSD or Web</p>
                        </div>
                        <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 w-full pt-5 relative">
                          <div v-if="formStep1.user_type === null" class="absolute inset-0 h-full bg-gray-100 opacity-80 z-20"></div>

                          <div v-if="formStep1.user_type === 'customer'" class="col-span-1 flex flex-row items-center space-x-3">
                            <input @focus="errorUserType = false" id="ussd" v-model="formStep1.access_type" value="ussd" name="access_type" class="border-gray-400 rounded-md" type="radio">
                            <label for="ussd" class="text-base text-gray-700 flex flex-col">
                              <span class="font-semibold">USSD access</span>
                              <span class="font-medium text-sm text-gray-500">Access account through USSD</span>
                            </label>
                          </div>

                          <div v-if="formStep1.user_type === 'admin'" class="col-span-1 flex flex-row items-center space-x-3">
                            <input @focus="errorUserType = false" id="web" v-model="formStep1.access_type" value="web" name="access_type" class="border-gray-400 rounded-md" type="radio">
                            <label for="web" class="text-base text-gray-700 flex flex-col">
                              <span class="font-semibold">Web access</span>
                              <span class="font-medium text-sm text-gray-500">Access account through web</span>
                            </label>
                          </div>
                        </div>
                        <small v-if="errorUserType" class="text-red-400 ml-7 pt-4">User type is required</small>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col col-span-1 relative">
                    <div v-if="checkUserTypeAccessType()" class="absolute inset-0 h-full bg-gray-100 opacity-80 z-20"></div>
                    <div class="flex flex-row justify-between pt-5 border-b pb-2">
                      <div class="font-medium text-lg text-gray-700">
                        <h3>Set user details</h3>
                      </div>
                    </div>
                    <div class="flex text-sm text-gray-500 pt-1">
                      <p>All fields are required to create and manage user accounts</p>
                    </div>
                    <div class="flex flex-col pt-5">
                      <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 md:max-w-5xl">
                        <div>
                          <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                          <div class="mt-1">
                            <input type="text" id="first-name" v-model="formStep1.firstName" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="John">
                          </div>
                        </div>
                        <div>
                          <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                          <div class="mt-1">
                            <input type="text" id="last-name" v-model="formStep1.lastName" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="Doe">
                          </div>
                        </div>
                        <div class="sm:col-span-2">
                          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                          <div class="mt-1">
                            <input id="email" type="email" v-model="formStep1.email" @input="formStep1.username = formStep1.email" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                        <div class="hidden">
                          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                          <div class="mt-1">
                            <input hidden id="username" type="text" v-model="formStep1.username" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
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
                            <input type="text" id="phone-number" v-model="formStep1.phoneNumber" class="py-3 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="254722000654">
                          </div>
                        </div>
                        <div v-if="formStep1.access_type === 'web'">
                          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                          <div class="mt-1">
                            <input id="password" type="password" v-model="formStep1.password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                        <div v-if="formStep1.access_type === 'web'">
                          <label for="password-confirmation" class="block text-sm font-medium text-gray-700">Password confirmation</label>
                          <div class="mt-1">
                            <input id="password-confirmation" type="password" v-model="formStep1.passwordConfirmation" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>

                        <div v-if="formStep1.access_type === 'ussd'">
                          <label for="pinSecret" class="block text-sm font-medium text-gray-700">Pin secret</label>
                          <div class="mt-1">
                            <input id="pinSecret" type="password" v-model="formStep1.pinSecret" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                        <div v-if="formStep1.access_type === 'ussd'">
                          <label for="pinSecret-confirmation" class="block text-sm font-medium text-gray-700">Pin Secret confirmation</label>
                          <div class="mt-1">
                            <input id="pinSecret-confirmation" type="password" v-model="formStep1.pinSecretConfirmation" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="flex">
                  <div class="ml-auto py-5">
                    <div class="space-x-3">
                      <button @click="$router.push('users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="validate(currentStep,currentStep+1)" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Next: permissions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            <!--            step 2-->
            <transition
                enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                enter-class="transform opacity-0 translate-x-full"
                enter-to-class="transform opacity-100 translate-x-0"
                leave-class="transform opacity-100 translate-x-0"
                leave-to-class="transform opacity-0 translate-x-full"
            >
              <div v-if="currentStep === 2" class="flex flex-col min-h-screen">
                <div class="flex flex-row justify-between pt-8 border-b pb-2">
                  <div class="font-medium text-base tracking-tight text-gray-700">
                    <h3>Set user roles</h3>
                  </div>
                </div>
                <div class="flex flex-col pt-4">
                  <div class="flex">
                    <div class="flex flex-col space-y-1">
                      <div :class="{ 'ring-2 ring-offset-2 bg-gray-50 ring-blue-300' : formStep2.user_has_roles }" class="flex-initial flex space-x-2 items-center py-4 px-3 rounded-md text-gray-700 text-base border cursor-pointer shadow" @click="formStep2.user_has_roles = !formStep2.user_has_roles;(formStep2.user_has_roles) ? errorUserHasRoles = false : errorUserHasRoles = true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p>Attach to existing roles</p>
                      </div>
                      <small v-if="errorUserHasRoles" class="text-red-400">Add user roles</small>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row justify-between pt-8 border-b pb-1">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user roles</h3>
                  </div>
                </div>
                <div class="flex text-sm text-gray-500 pt-1">
                  <p>Select user access roles</p>
                </div>
                <small v-if="errorUserRoles" class="text-red-400 m-2">Set user roles</small>
                <div :class="{'opacity-50 cursor-not-allowed' : !formStep2.user_has_roles}" class="flex flex-col pt-6">
                  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="relative px-6 py-3">
                              <span class="sr-only">Select</span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Permissions
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                            <!-- Odd row roleName: string, roleType: string, description: string, id: string -->
                            <tr v-for="(role,i) in available_roles" :key="role.id" :class="{'bg-white' : i % 2 === 0, 'bg-gray-50' : i % 2 !== 0 }">
                              <td class="pl-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <input :id="'role'+i" @change="setEventVal" :value="role" :disabled="!formStep2.user_has_roles" :name="'role'+i" class="border-gray-400 rounded-md" type="checkbox">
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ role.roleName }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ role.roleType }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ role.roleDescription ? role.roleDescription : 'customer or admin role description' }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-6">
                    <div class="space-x-3">
                      <button @click="$router.push('users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="launchSpecific(currentStep - 1)" type="button" class="inline-flex items-center px-2.5 py-1.5 border border border-gray-400 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Previous: permissions
                      </button>

                      <button @click="validate(currentStep,currentStep + 1)" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Next: review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            <!--            step 3-->
            <transition
                enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                enter-class="transform opacity-0 translate-x-full"
                enter-to-class="transform opacity-100 translate-x-0"
                leave-class="transform opacity-100 translate-x-0"
                leave-to-class="transform opacity-0 translate-x-full"
            >
              <div v-if="currentStep === 3" class="flex flex-col">
                <div class="flex flex-row justify-between pt-8 border-b pb-2">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Review user</h3>
                  </div>
                </div>
                <div class="flex text-sm text-gray-500 pt-1">
                  <p>Review your choices. After you create the user, you can view and download the autogenerated password.</p>
                </div>
                <div class="flex flex-row justify-between pt-2 border-b pb-1">
                  <div class="font-medium text-base text-gray-700">
                    <h3>User details</h3>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 border-b pb-8">
                  <div class="flex flex-col ml-8 pt-4 space-y-2">
                    <div class="flex flex-row space-x-4 tracking-wide text-sm ">
                        <h6 class="font-medium text-gray-900">Full name</h6>
                        <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.firstName }} {{ formStep1.lastName }}</span>
                    </div>

                    <div class="flex flex-row space-x-4 tracking-wide text-sm">
                        <h6 class="font-medium text-gray-900">User type</h6>
                        <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.user_type }}</span>
                    </div>

                    <div class="flex flex-row space-x-4 tracking-wide text-sm">
                      <h6 class="font-medium text-gray-900">Access type</h6>
                      <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.access_type }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col ml-8 pt-4 space-y-2">
                    <div class="flex flex-row space-x-4 tracking-wide text-sm ">
                        <h6 class="font-medium text-gray-900">Email</h6>
                        <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.email }}</span>
                    </div>

                    <div class="flex flex-row space-x-4 tracking-wide text-sm">
                        <h6 class="font-medium text-gray-900">Phone number</h6>
                        <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.phoneNumber }}</span>
                    </div>

                    <div class="flex flex-row space-x-4 tracking-wide text-sm">
                      <h6 class="font-medium text-gray-900">Password/Pin Secret</h6>
                      <span class="text-gray-500 border-dotted border-b border-gray-600">{{ (formStep1.password === '' || !formStep1.password) ? formStep1.pinSecret : formStep1.password }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row justify-between pt-4 border-b pb-1">
                  <div class="font-medium text-base text-gray-700">
                    <h3>Roles summary</h3>
                  </div>
                </div>
                <div class="flex text-sm text-gray-500 pt-1">
                  <p>The following roles will be assigned to the user.</p>
                </div>
                <div class="flex flex-col pt-4">
                  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role name
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role type
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <!-- Odd row -->
                          <tr v-for="(role,i) in formStep2.user_roles" :key="i" :class="{'bg-white' : i % 2 === 0, 'bg-gray-50' : i % 2 !== 0 }">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {{ role.roleName }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ role.roleType }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ role.roleDescription ? role.roleDescription : 'customer or admin role description' }}
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-6">
                    <div class="space-x-3">
                      <button @click="$router.push('users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="createUser" :disabled="loading" type="button" :class="{'opacity-75 cursor-not-allowed' : loading}" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        <svg v-if="loading" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Create user
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            <!--            step 4-->
            <transition
                enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
                enter-class="transform opacity-0 translate-x-full"
                enter-to-class="transform opacity-100 translate-x-0"
                leave-class="transform opacity-100 translate-x-0"
                leave-to-class="transform opacity-0 translate-x-full"
            >
            <div v-if="currentStep === 4" class="mx-auto w-full">

              <div class="overflow-hidden">
                <div class="py-5">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Applicant Information
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and application.
                  </p>
                </div>
                <div class="border-t border-gray-200 py-5">
                  <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">
                        Full name
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        {{ responseData.user.firstName }} {{ responseData.user.lastName }}
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">
                        User type
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        {{ responseData.user.userType }}
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">
                        Email address
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        {{ responseData.user.email }}
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">
                        Phone number
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        {{ responseData.user.phoneNumber }}
                      </dd>
                    </div>
                    <div class="sm:col-span-2">
                      <dt class="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        {{ responseData.message }} successfully for {{ organisation }}
                      </dd>
                    </div>
                    <div class="sm:col-span-2">
                      <dt class="text-sm font-medium text-gray-500">
                        Downloads
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        <ul role="list" class="border border-gray-200 rounded-md divide-y divide-gray-200">
                          <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div class="w-0 flex-1 flex items-center">
                              <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd"></path>
                              </svg>
                              <span class="ml-2 flex-1 w-0 truncate">
                                  {{ organisation }} Credentials.csv
                                </span>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <button @click="download_csv_file([[responseData.user.username, responseData.user.userType.toLowerCase() === 'admin' ? formStep1.password : formStep1.pinSecret]])" type="button" class="font-medium text-indigo-600 hover:text-indigo-500">
                                Download
                              </button>
                            </div>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

            </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
