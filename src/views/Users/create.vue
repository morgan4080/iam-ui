<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import {ref, computed, watch} from "vue"
import {getPermissions, getRoles} from "@/modules/all"
import { useStore } from "vuex"
import router from "@/router"
import { mapActions } from "@/modules/mapStore"


const { postUser, defineNotification, verifyUnique } = mapActions()



const store = useStore()

// const tenantId = computed(() => store.state.user ? store.state.user.tenantId : null)

// const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

const available_roles = ref(<{name: string, roleType: string, keycloakRoleId: string, roleDescription: string, id: string }[]>[])

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

const formUSSDAccess = ref(<{ phoneNumber: string, pin?: string, pinConfirmation?: string }> {
  phoneNumber: '',
  pin: '',
  pinConfirmation: ''
})

const formRoles = ref(<{user_has_roles: any, user_roles: any}> {
  user_has_roles: null,
  user_roles: null
})

const currentStep = ref(<number> 1)

/*const steps = ref([
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
])*/

// const errorUserHasRoles = ref(false)

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

  formRoles.value.user_roles = filtered

  if (filtered.length > 0) {
    errorUserRoles.value = false
  }

}

const loading = ref(false)

// const responseData = ref(<{ user: { username: string, userType: string, email: string, firstName: string, lastName: string, phoneNumber: string, id: string }, message: string }>{})

let query = ref(<string>`?`)

interface qrInterface {
  phoneNumber: string,
  email: string,
  username: string
}

let qrObject: qrInterface = {
  phoneNumber: '',
  email: '',
  username: '',
}

function nextStep () {
  currentStep.value = currentStep.value + 1
}

const saveUser = async (rolesPayload: string[]) => {
  let payload
  if (formContacts.value.user_types.findIndex((type: string): boolean => type === 'USSD') !== -1 && formContacts.value.user_types.findIndex((type: string): boolean => type === 'WEB') !== -1) {
    payload = {
      firstName: formContacts.value.firstName,
      lastName: formContacts.value.lastName,
      contact: {
        email: formContacts.value.email,
        phone: formContacts.value.phoneNumber
      },
      webCredentials: formWebAccess.value,
      ussdCredentials: formUSSDAccess.value,
      enabled: true,
      userTypes: formContacts.value.user_types,
      permissions: [],
      userRoles: [],
      userRoleIds: rolesPayload,
    }

    delete payload.webCredentials.passwordConfirmation

    delete  payload.ussdCredentials.pinConfirmation

  } else if (formContacts.value.user_types.findIndex((type: string): boolean => type === 'USSD') !== -1 && formContacts.value.user_types.findIndex((type: string): boolean => type === 'WEB') === -1) {
    payload = {
      firstName: formContacts.value.firstName,
      lastName: formContacts.value.lastName,
      contact: {
        email: formContacts.value.email,
        phone: `254${formContacts.value.phoneNumber}`
      },
      webCredentials: {
        username: `254${formUSSDAccess.value.phoneNumber}`,
        password: formUSSDAccess.value.pin,
      },
      ussdCredentials: {
        ...formUSSDAccess.value,
        phoneNumber: `254${formUSSDAccess.value.phoneNumber}`,
      },
      enabled: true,
      userTypes: formContacts.value.user_types,
      userRoles: [],
      userRoleIds: rolesPayload,
    }

    delete  payload.ussdCredentials.pinConfirmation

  } else if (formContacts.value.user_types.findIndex((type: string): boolean => type === 'USSD') === -1 && formContacts.value.user_types.findIndex((type: string): boolean => type === 'WEB') !== -1) {
    payload = {
      firstName: formContacts.value.firstName,
      lastName: formContacts.value.lastName,
      contact: {
        email: formContacts.value.email,
        phone: `254${formContacts.value.phoneNumber}`
      },
      webCredentials: formWebAccess.value,
      enabled: true,
      userTypes: formContacts.value.user_types,
      userRoles: [],
      userRoleIds: rolesPayload,
    }
    delete payload.webCredentials.passwordConfirmation
  }
  try {
    loading.value = true
    const response = await postUser(payload)
    await defineNotification( { message: response.messages[0].message, success: true })
    await router.push('/admin/users')
  } catch (e: any) {
    await defineNotification( { message: e.message, error: true })
  } finally {
    loading.value = false
    await router.push('/admin/users')
  }
}

function setUserType (e: any, payload: string) {
  if (e.target.checked) {
    formContacts.value.user_types.push(payload)
  } else {
    // remove when unchecked
    let index = formContacts.value.user_types.findIndex((type: string): boolean => type === payload)
    formContacts.value.user_types.splice(index, 1)
  }
}

function saveRoles() {
  saveUser(formRoles.value.user_roles.map((role: any): any => role.keycloakRoleId))
}

function previousStep() {
  if (currentStep.value !== 1) {
    currentStep.value = currentStep.value - 1
  }
}

const byIdentifier = async () => {
  for (const [key, value] of Object.entries(qrObject)) {
    if (value && query.value === "?") {
      query.value += `${key}=${value}`
    } else if (value && query.value !== "?") {
      query.value += `&${key}=${value}`
    }
  }
  console.log(query.value)

  let response = await verifyUnique(query.value)

  query.value = `?`

  return response === 'unique';
}

const setQuery = async (e: any) => {
  if (e.target.id === 'email') {
    qrObject.phoneNumber = ''
    qrObject.email = formContacts.value.email
    qrObject.username = ''
  }
  if (e.target.id === 'phone-number') {
    qrObject.phoneNumber = formContacts.value.phoneNumber
    qrObject.email = ''
    qrObject.username = ''
  }
  if (e.target.id === 'phone-number') {
    qrObject.phoneNumber = formContacts.value.phoneNumber
    qrObject.email = ''
    qrObject.username = ''
  }
  if (e.target.id === 'phonex') {
    let response0 = await verifyUnique(`?phoneNumber=${formUSSDAccess.value.phoneNumber}`)
    if (response0 !== 'unique') {
      formUSSDAccess.value.phoneNumber = ''
      await defineNotification( { message: `User with that phone number already exists`, error: true })
    }
    return
  }
  if (e.target.id === 'username') {
    qrObject.phoneNumber = ''
    qrObject.email = ''
    qrObject.username = formWebAccess.value.username
  }

  let response = await byIdentifier()

  if (!response) {
    for (const [key, value] of Object.entries(qrObject)) {
      if (value) {
        if (key === 'email') formContacts.value.email = ''
        if (key === 'phoneNumber') formContacts.value.phoneNumber = ''
        if (key === 'username') formWebAccess.value.username = ''
        await defineNotification( { message: `User with that ${key} already exists`, error: true })
      }
    }
  }
}

async function setupFormContacts() {
  if (formContacts.value.user_types.length > 0) {
    if (formContacts.value.user_types.findIndex((type: string): boolean => type === 'WEB') !== -1) {
      nextStep()
    } else if (formContacts.value.user_types.findIndex((type: string): boolean => type === 'USSD') !== -1) {
      currentStep.value = currentStep.value + 2
    }
  } else {
    await defineNotification( { message: "Kindly Select a user type", error: true })
  }
}

async function setupFormWebAccess() {
  if (formContacts.value.user_types.findIndex((type: string): boolean => type === 'USSD') !== -1) {
    if (formWebAccess.value.password === formWebAccess.value.passwordConfirmation) {
      nextStep()
    } else {
      await defineNotification( { message: `Passwords don't match`, error: true })
    }
  } else {
    currentStep.value = 4
  }
}

async function setupFormUSSDAccess() {
  if (formUSSDAccess.value.pin === formUSSDAccess.value.pinConfirmation) {
    currentStep.value = 4
  } else {
    await defineNotification( { message: `Pins don't match`, error: true })
  }
}
</script>

<template>
  <div class="w-full max-h-screen overflow-y-scroll">
    <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div class="shadow sm:overflow-hidden">
        <div class="bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Create User
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Setup account</p>
          </div>
          <!--            step 1-->
          <transition
              enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
              leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
              enter-class="transform opacity-0 translate-x-full"
              enter-to-class="transform opacity-100 translate-x-0"
              leave-class="transform opacity-100 translate-x-0"
              leave-to-class="transform opacity-0 translate-x-full"
          >
            <form @submit.prevent="setupFormContacts" v-if="currentStep === 1" class="flex flex-col min-h-screen">
              <div class="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8 pb-8 sm:border-t sm:border-gray-200 mt-6">
                <div class="flex flex-col pt-5 pb-8 md:max-w-2xl space-y-2 col-span-1">
                  <div class="flex flex-col sm:border-b sm:border-gray-200 sm:pb-5">
                    <div class="font-medium text-lg text-gray-700">
                      <h3>User Types</h3>
                    </div>
                    <p class="text-sm text-gray-500">Select USSD or Web access types</p>
                  </div>
                  <div>
                    <div class="pt-3">
                      <div class="flex flex-row items-start space-x-3">
                        <input id="admin" @change="setUserType($event, 'WEB')" name="user_types" class="mt-1 border-gray-400 rounded-md" type="checkbox">
                        <label for="admin" class="text-base text-gray-700 flex flex-col">
                          <span class="block text-sm font-medium text-gray-700">Web Access</span>
                          <span class="font-normal text-sm text-gray-500">Create admin user</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="mt-1">
                      <div class="flex flex-row items-start space-x-3">
                        <input id="customer" @change="setUserType($event, 'USSD')" name="user_types" class="mt-1 border-gray-400 rounded-md" type="checkbox">
                        <label for="customer" class="text-base text-gray-700 flex flex-col">
                          <span class="block text-sm font-medium text-gray-700">USSD Access</span>
                          <span class="font-normal text-sm text-gray-500">Create customer account</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col pt-5 pb-8 md:max-w-2xl space-y-2 col-span-1">
                  <div class="flex flex-col sm:border-b sm:border-gray-200 sm:pb-5">
                    <div class="font-medium text-lg text-gray-700">
                      <h3>Set Contact details</h3>
                    </div>
                    <p>All fields are required to create and manage user accounts</p>
                  </div>
                  <div :class="{'opacity-50  cursor-not-allowed' : formContacts.user_types.length === 0}" class="flex flex-col pt-5 cursor-not-allowed">
                    <div class="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                        <div class="mt-1">
                          <input :disabled="formContacts.user_types.length === 0" type="text" id="first-name" v-model="formContacts.firstName" class="py-1 px-4 block w-full shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" required>
                        </div>
                      </div>
                      <div>
                        <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                        <div class="mt-1">
                          <input :disabled="formContacts.user_types.length === 0" type="text" id="last-name" v-model="formContacts.lastName" class="py-1 px-4 block w-full shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" required>
                        </div>
                      </div>
                      <div class="sm:col-span-2">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <div class="mt-1">
                          <input @change="setQuery($event)" :disabled="formContacts.user_types.length === 0" id="email" type="email" v-model.lazy="formContacts.email" class="py-1 px-4 block w-full shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" required>
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
                          <input @change="setQuery($event)" :disabled="formContacts.user_types.length === 0" type="text" id="phone-number" v-model.lazy="formContacts.phoneNumber" class="py-1 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
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
                    <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                      Next: {{ formContacts.user_types.findIndex((type) => type === 'WEB') !== -1 ? 'Web' : 'USSD' }} Credentials
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
            <div v-if="currentStep === 2" class="flex flex-col min-h-screen sm:border-t sm:border-gray-200 mt-3">
              <form @submit.prevent="setupFormWebAccess">

                <div class="flex flex-col pb-2 mt-6">
                  <div>
                    <h3 class="text-base leading-6 font-medium text-gray-900">
                      Set Web Credentials
                    </h3>
                    <p class="mt-1 text-xs text-gray-500">Credentials to access web interface.</p>
                  </div>
                  <div class="flex flex-col mt-6 sm:mt-5  space-y-2">
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Full names
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex">
                          <span class="font-semibold block w-full underline" >
                            {{ formContacts.firstName }} {{ formContacts.lastName }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Username
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input @change="setQuery($event)" v-model.lazy="formWebAccess.username" type="text" name="username" id="username" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col border-b mt-4 pt-3 pb-8 space-y-2">
                  <div>
                    <h3 class="text-base leading-6 font-medium text-gray-900">
                      Temporary Password
                    </h3>
                    <p class="mt-1 max-w-2xl text-xs text-gray-500">
                      Set temporary password.
                    </p>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="password" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Password
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex rounded-md shadow-sm">
                        <input v-model="formWebAccess.password" type="password" name="password" id="password" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                      </div>
                    </div>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label for="password-c" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Password Confirmation
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex rounded-md shadow-sm">
                        <input v-model="formWebAccess.passwordConfirmation" type="password" name="password-c" id="password-c" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-5">
                    <div class="space-x-3">
                      <button @click="previousStep()" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500">
                        Previous
                      </button>

                      <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        {{ formContacts.user_types.findIndex((type) => type === 'USSD') !== -1 ? 'Next: USSD Credentials' : 'Save User' }}
                      </button>
                    </div>
                  </div>
                </div>

              </form>
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
              <form @submit.prevent="setupFormUSSDAccess">

                <div class="flex flex-col pb-2 mt-6">
                  <div>
                    <h3 class="text-base leading-6 font-medium text-gray-900">
                      Set USSD Credentials
                    </h3>
                    <p class="mt-1 text-xs text-gray-500">Credentials to access ussd interface</p>
                  </div>
                  <div class="flex flex-col mt-6 sm:mt-5  space-y-2">
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Full names
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex">
                            <span class="font-semibold block w-full underline" >
                              {{ formContacts.firstName }} {{ formContacts.lastName }}
                            </span>
                        </div>
                      </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                      <label for="phonex" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
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
                          <input @change="setQuery($event)" type="text" id="phonex" v-model="formUSSDAccess.phoneNumber" class="py-1 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" required>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col border-b mt-4 pt-3 pb-8 space-y-2">
                  <div>
                    <h3 class="text-base leading-6 font-medium text-gray-900">
                      Temporary Pin
                    </h3>
                    <p class="mt-1 max-w-2xl text-xs text-gray-500">
                      Set temporary Pin.
                    </p>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <div>
                      <label for="pin" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Pin
                      </label>
                      <p class="mt-2 text-xs text-gray-500">Maximum of 4 numbers</p>
                    </div>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex rounded-md shadow-sm">
                        <input v-model="formUSSDAccess.pin" pattern="[0-9]{4,4}" type="password" name="pin" id="pin" autocomplete="pin" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                      </div>
                    </div>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <div>
                      <label for="pin-c" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Pin Confirmation
                      </label>
                      <p class="mt-2 text-xs text-gray-500">Ensure it matches the pin above</p>
                    </div>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex rounded-md shadow-sm">
                        <input v-model="formUSSDAccess.pinConfirmation" pattern="[0-9]{4,4}" type="password" name="pin-c" id="pin-c" autocomplete="pin-c" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
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

                      <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        Next: Assign Roles
                      </button>
                    </div>
                  </div>
                </div>

              </form>

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

              <div>
                <h3 class="text-base leading-6 font-medium text-gray-900 border-t pt-4 mt-6">
                  Set user roles
                </h3>
                <p class="mt-1 text-xs text-gray-500">Select user access roles</p>
              </div>
              <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Full names
                </label>
                <div class="mt-1 sm:mt-0 sm:col-span-2">
                  <div class="max-w-lg flex">
                            <span class="font-semibold block w-full underline" >
                              {{ formContacts.firstName }} {{ formContacts.lastName }}
                            </span>
                  </div>
                </div>
              </div>
              <form @submit.prevent="saveRoles">
                <div class="flex flex-col pt-6">
                  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Select
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <!-- Odd row name: string, roleType: string, description: string, id: string -->
                          <tr v-for="(role,i) in available_roles" :key="role.id" :class="{'bg-white' : i % 2 === 0, 'bg-gray-50' : i % 2 !== 0 }">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <input :id="'role'+i" @change="setEventVal" :value="role" :name="'role'+i" class="border-gray-400 rounded-md" type="checkbox">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {{ role.name }}
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

                      <button :disabled="loading" type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Save: User
                      </button>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
