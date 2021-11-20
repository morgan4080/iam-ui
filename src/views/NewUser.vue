<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {ref, reactive} from "vue"

const available_roles = reactive([
  {
    id: 1,
    name: 'user',
    permissions: 'Read',
    description: 'Nulla facilisis aliquam orci vel gravida.'
  },
  {
    id: 2,
    name: 'admin',
    permissions: 'Read/Write',
    description: 'Nulla facilisis aliquam orci vel gravida.'
  },
  {
    id: 3,
    name: 'super-admin',
    permissions: 'Full access',
    description: 'Nulla facilisis aliquam orci vel gravida.'
  }
])

const formStep1 = reactive({
  username: null,
  user_type: null
})

const formStep2: {user_has_roles: any, user_roles: any} = reactive({
  user_has_roles: null,
  user_roles: null
})

const rulesStep1 = {
  username: { required },
  user_type: { required }
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
    launchSpecific(stepInput)
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
    launchSpecific(stepInput)
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

function createUser() {
  loading.value = true
  console.log(formStep1)
  console.log(formStep2)

  // upload to server
}

</script>

<template>
  <div class="flex-col h-screen w-full pb-12" style="min-height: 640px;">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-3 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div class="flex-1 min-w-0">
          <div class="flex flex-col">
            <div class="flex flex-row justify-between">
              <div class="text-lg font-bold tracking-tight text-gray-900">
                <h3>Add User</h3>
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
                <div class="flex flex-row justify-between pt-5 border-b pb-2">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user details</h3>
                  </div>
                </div>
                <div class="flex flex-col mx-auto pt-8">
                  <div class="flex flex-row items-center space-x-4">
                    <label for="username" class="text-base font-semibold text-gray-700">Username *</label>
                    <div class="flex flex-col">
                      <input @focus="errorUsername = false" id="username" v-model="formStep1.username" class="border-gray-400 rounded-md" type="text">
                      <small v-if="errorUsername" class="text-red-400">Username is required</small>
                    </div>
                  </div>

                </div>
                <div class="flex flex-row justify-between pt-5 border-b pb-1">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user access type</h3>
                  </div>
                </div>
                <div class="flex text-sm text-gray-500 pt-1">
                  <p>Select how these users will access lending services. Mobile USSD or Web</p>
                </div>
                <div class="flex flex-row items-center pt-5 pb-20 w-full border-b">
                  <div class="flex items-start mx-auto">
                    <h4 class="font-semibold pt-2 pr-4 text-gray-700">Select user type *</h4>
                    <div class="flex flex-col space-y-3">
                      <div class="flex flex-row items-center space-x-3">
                        <input @focus="errorUserType = false" id="ussd" v-model="formStep1.user_type" value="ussd" name="user_type" class="border-gray-400 rounded-md" type="radio">
                        <label for="ussd" class="text-base text-gray-700 flex flex-col">
                          <span class="font-semibold">USSD access</span>
                          <span class="font-medium text-sm text-gray-500">For lending customers using USSD</span>
                        </label>
                      </div>
                      <div class="flex flex-row items-center space-x-3">
                        <input @focus="errorUserType = false" id="web" v-model="formStep1.user_type" value="web" name="user_type" class="border-gray-400 rounded-md" type="radio">
                        <label for="web" class="text-base text-gray-700 flex flex-col">
                          <span class="font-semibold">Web access</span>
                          <span class="font-medium text-sm text-gray-500">For lending organisation users</span>
                        </label>
                      </div>
                      <small v-if="errorUserType" class="text-red-400 ml-7">User type is required</small>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-6">
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
                            <!-- Odd row -->
                            <tr v-for="(role,i) in available_roles" :key="i" :class="{'bg-white' : i % 2 === 0, 'bg-gray-50' : i % 2 !== 0 }">
                              <td class="pl-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <input :id="'role'+i" @change="setEventVal" :value="role" :disabled="!formStep2.user_has_roles" :name="'role'+i" class="border-gray-400 rounded-md" type="checkbox">
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ role.name }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ role.permissions }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ role.description }}
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
                <div class="flex flex-col ml-8 pt-4 space-y-2">
                  <div class="flex flex-row space-x-4 tracking-wide text-sm ">
                      <h6 class="font-medium text-gray-900">Username</h6>
                      <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.username }}</span>
                  </div>
                  <div class="flex flex-row space-x-4 tracking-wide text-sm">
                      <h6 class="font-medium text-gray-900">Access type</h6>
                      <span class="text-gray-500 border-dotted border-b border-gray-600">{{ formStep1.user_type }}</span>
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
                          <!-- Odd row -->
                          <tr v-for="(role,i) in formStep2.user_roles" :key="i" :class="{'bg-white' : i % 2 === 0, 'bg-gray-50' : i % 2 !== 0 }">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {{ role.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ role.permissions }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ role.description }}
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

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
