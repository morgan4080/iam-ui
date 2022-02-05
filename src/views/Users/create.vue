<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {ref, reactive, computed} from "vue"
import {getPermissions, getRoles, postUser} from "@/modules/all"
import { useStore } from "vuex"

const store = useStore()

const tenantId = computed(() => store.state.user ? store.state.user.tenantId : null)

const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

const available_roles = ref(<{roleName: string, roleType: string, keycloakRoleId: string, roleDescription: string, id: string }[]>[])

const available_permissions = ref(<any[]>[])

getRoles().then((response: any) => {
  available_roles.value = response.records
}).catch((e: any) => {
  alert(e.message)
})

getPermissions().then((data: any) => {
  available_permissions.value = data.records
}).catch((e: any) => {
  alert(e.message)
})

interface form1Interface {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  user_types: string[]
}

const formContacts = ref(<form1Interface>{
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  user_types: [],
})

const formWebAccess = ref(<{ username: string, password?: string, passwordConfirmation?: string }>{
  username: '',
  password: '',
  passwordConfirmation: ''
})

const formUSSDAccess = ref(<{ phone: string, pin?: string, pinConfirmation?: string }> {
  phone: '',
  pin: '',
  pinConfirmation: ''
})

const formStep2 = ref(<{user_has_roles: any, user_roles: any}> {
  user_has_roles: null,
  user_roles: null
})

const currentStep = ref(<number> 1)

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

const errorUserHasRoles = ref(false)

const errorUserRoles = ref(false)

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
  formStep2.value.user_roles = filtered
  if (filtered.length > 0) {
    errorUserRoles.value = false
  }
}

const loading = ref(false)

const responseData = ref(<{ user: { username: string, userType: string, email: string, firstName: string, lastName: string, phoneNumber: string, id: string }, message: string }>{})

function nextStep () {
  currentStep.value = currentStep.value + 1
}

async function saveUser() {
  try {
    loading.value = true

    let payload = {
      contacts: formContacts.value,
      webCredentials: formWebAccess.value,
      ussdCredentials: formUSSDAccess.value,
    }

    delete payload.webCredentials.passwordConfirmation

    delete  payload.ussdCredentials.pinConfirmation

    console.log("save user payload", payload)
    // responseData.value = await postUser(payload)
  } catch (e: any) {
    alert(e.message)
  } finally {
    loading.value = false
    nextStep()
  }
}

function setUserType (e: any, payload: string) {
  if (e.target.checked) {
    formContacts.value.user_types.push(payload)
  } else {
    // remove when unchecked
  }
}

function saveRoles() {
  // pick key cloak ids for roles

}

</script>

<template>
  <div class="flex-col h-screen w-full pb-12 overflow-y-auto" style="min-height: 640px;">
    <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
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
                    <a  v-if="step.state === 'Completed'" href="#" class="block w-2.5 h-2.5 bg-indigo-600 rounded-full hover:bg-indigo-900">
                      <span class="sr-only">Step {{ step.stage }}</span>
                    </a>

                    <!-- Current Step -->
                    <a v-if="step.state === 'Current'" href="#" class="relative flex items-center justify-center" aria-current="step">
                      <span class="absolute w-5 h-5 p-px flex" aria-hidden="true">
                        <span class="w-full h-full rounded-full bg-indigo-200"></span>
                      </span>
                      <span class="relative block w-2.5 h-2.5 bg-indigo-600 rounded-full" aria-hidden="true"></span>
                      <span class="sr-only">Step {{ step.stage }}</span>
                    </a>

                    <!-- Upcoming Step -->
                    <a v-if="step.state === 'Upcoming'" href="#" class="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400">
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
                <div class="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8 border-b pb-8">
                  <div class="flex flex-col col-span-1">
                    <div class="flex flex-row justify-between pt-5 border-b pb-2">
                      <div class="font-medium text-lg text-gray-700">
                        <h3>Set User Type</h3>
                      </div>
                    </div>
                    <div class="flex text-sm text-gray-500">
                      <p>Select how these users will access lending services. Mobile USSD or Web</p>
                    </div>
                    <div class="flex flex-col space-y-6 mt-6">
                      <div class="col-span-1 flex flex-row items-start space-x-3">
                        <input id="admin" @change="setUserType($event, 'WEB')" name="user_types" class="mt-1 border-gray-400 rounded-md" type="checkbox">
                        <label for="admin" class="text-base text-gray-700 flex flex-col">
                          <span class="font-semibold">Web Access</span>
                          <span class="font-medium text-sm text-gray-500">Create admin user</span>
                        </label>
                      </div>

                      <div class="col-span-1 flex flex-row items-start space-x-3">
                        <input id="customer" @change="setUserType($event, 'USSD')" name="user_types" class="mt-1 border-gray-400 rounded-md" type="checkbox">
                        <label for="customer" class="text-base text-gray-700 flex flex-col">
                          <span class="font-semibold">USSD Access</span>
                          <span class="font-medium text-sm text-gray-500">Create customer account</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col col-span-1 relative">
                    <div v-if="formContacts.user_types.length === 0" class="absolute inset-0 h-full bg-gray-100 opacity-80 z-20"></div>
                    <div class="flex flex-row justify-between pt-5 border-b pb-2">
                      <div class="font-medium text-lg text-gray-700">
                        <h3>Set Contact details</h3>
                      </div>
                    </div>
                    <div class="flex text-sm text-gray-500">
                      <p>All fields are required to create and manage user accounts</p>
                    </div>
                    <div class="flex flex-col pt-5">
                      <div class="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                          <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                          <div class="mt-1">
                            <input type="text" id="first-name" v-model="formContacts.firstName" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                        <div>
                          <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                          <div class="mt-1">
                            <input type="text" id="last-name" v-model="formContacts.lastName" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                        <div class="sm:col-span-2">
                          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                          <div class="mt-1">
                            <input id="email" type="email" v-model="formContacts.email" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
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
                            <input type="text" id="phone-number" v-model="formContacts.phoneNumber" class="py-1 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="flex">
                  <div class="ml-auto py-5">
                    <div class="space-x-3">
                      <button @click="$router.push('/admin/users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="nextStep()" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Next: Web Credentials
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

                <div class="flex flex-col pb-2">
                  <div class="flex flex-row justify-between border-b pb-2">
                    <div class="font-medium text-lg text-gray-700">
                      <h3>Set Web Credentials</h3>
                    </div>
                  </div>
                  <div class="flex text-sm text-gray-500">
                    <p>Credentials to access web interface</p>
                  </div>
                  <div class="flex flex-col pt-5">
                    <div>
                      <div class="mt-1">
                          <span class="py-1 font-semibold block w-full" >
                            {{ formContacts.firstName }} {{ formContacts.lastName }}
                          </span>
                      </div>
                    </div>
                    <div class="flex flex-col pt-6 md:max-w-2xl space-y-2">
                      <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                        <div class="mt-1">
                          <input type="text" id="username" v-model="formWebAccess.username" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col border-b pt-6 pb-8 md:max-w-2xl space-y-2">
                  <div class="flex flex-row justify-between border-b pb-2">
                    <div class="font-medium text-lg text-gray-700">
                      <h3>Temporary Password</h3>
                    </div>
                  </div>
                  <div class="flex text-sm text-gray-500">
                    <p>Set temporary password</p>
                  </div>
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="mt-1">
                      <input id="password" type="password" v-model="formWebAccess.password" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    </div>
                  </div>
                  <div>
                    <label for="password-confirmation" class="block text-sm font-medium text-gray-700">Password confirmation</label>
                    <div class="mt-1">
                      <input id="password-confirmation" type="password" v-model="formWebAccess.passwordConfirmation" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-5">
                    <div class="space-x-3">
                      <button @click="$router.push('/admin/users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="nextStep()" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Next: USSD Credentials
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
              <div v-if="currentStep === 3" class="flex flex-col min-h-screen">

                <div class="flex flex-col pb-2">
                  <div class="flex flex-row justify-between border-b pb-2">
                    <div class="font-medium text-lg text-gray-700">
                      <h3>Set USSD Credentials</h3>
                    </div>
                  </div>
                  <div class="flex text-sm text-gray-500">
                    <p>Credentials to access ussd interface</p>
                  </div>
                  <div class="flex flex-col pt-5">
                    <div>
                      <div class="mt-1">
                          <span class="py-1 font-semibold block w-full" >
                            {{ formContacts.firstName }} {{ formContacts.lastName }}
                          </span>
                      </div>
                    </div>
                    <div class="flex flex-col pt-6 md:max-w-2xl space-y-2">
                      <label for="phone-number" class="block text-sm font-medium text-gray-700">Phone Number</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 flex items-center">
                          <label for="country" class="sr-only">Country</label>
                          <select id="phone" class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                            <option>KE</option>
                          </select>
                        </div>
                        <input type="text" id="phonex" v-model="formUSSDAccess.phone" class="py-1 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="254722000654">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col border-b pt-6 pb-8 md:max-w-2xl space-y-2">
                  <div class="flex flex-row justify-between border-b pb-2">
                    <div class="font-medium text-lg text-gray-700">
                      <h3>Temporary Pin</h3>
                    </div>
                  </div>
                  <div class="flex text-sm text-gray-500">
                    <p>Set temporary Pin</p>
                  </div>
                  <div>
                    <label for="pin" class="block text-sm font-medium text-gray-700">Pin</label>
                    <div class="mt-1">
                      <input id="pin" type="password" v-model="formUSSDAccess.pin" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    </div>
                  </div>
                  <div>
                    <label for="pin-confirmation" class="block text-sm font-medium text-gray-700">Pin confirmation</label>
                    <div class="mt-1">
                      <input id="pin-confirmation" type="password" v-model="formUSSDAccess.pinConfirmation" class="py-1 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-5">
                    <div class="space-x-3">
                      <button @click="$router.push('/admin/users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="saveUser" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Save: User
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
              <div v-if="currentStep === 4" class="flex flex-col min-h-screen">
                <div class="flex flex-col pt-4">
                  <div class="flex">
                    <div class="flex flex-col space-y-1">

                    </div>
                  </div>
                </div>
                <div class="flex flex-row justify-between pt-8 border-b pb-1">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user roles</h3>
                  </div>
                </div>
                <div class="flex text-sm text-gray-500">
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
                      <button @click="$router.push('/admin/users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="saveRoles" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Save Roles
                      </button>
                    </div>
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
