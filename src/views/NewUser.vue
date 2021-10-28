<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {ref, reactive} from "vue"

const formStep1 = reactive({
  username: null,
  user_type: null
})

const rulesStep1 = {
  username: { required },
  user_type: { required }
}

const vuelidateStep1 = useVuelidate(rulesStep1, formStep1)

const addRoleToUser = ref(false)


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

function launchSpecific(stepInput: number) {
  if (stepInput) {
    console.log(vuelidateStep1.value.username)
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

</script>

<template>
  <div class="flex-col h-screen w-full overflow-y-auto" style="min-height: 640px;">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-3 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div class="flex-1 min-w-0">
          <div class="flex flex-col">
            <div class="flex flex-row justify-between">
              <div class="font-semibold text-2xl text-gray-700">
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
                enter-class="transform translate-x-full"
                enter-to-class="transform translate-x-0"
                leave-class="transform translate-x-0"
                leave-to-class="transform translate-x-full"
            >
              <div v-if="currentStep === 1" class="flex flex-col">
                <div class="flex flex-row justify-between pt-8 border-b pb-2">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user details</h3>
                  </div>
                </div>
                <div class="flex flex-col mx-auto pt-8">
                  <div class="flex flex-row items-center space-x-4">
                    <label for="username" class="text-base font-semibold text-gray-700">Username *</label>
                    <input id="username" v-model="formStep1.username" class="border-gray-400 rounded-md" type="text">
                  </div>
                </div>
                <div class="flex flex-row justify-between pt-8 border-b pb-1">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user access type</h3>
                  </div>
                </div>
                <div class="flex text-sm text-gray-500 pt-1">
                  <p>Select how these users will access lending services. Mobile USSD or Web</p>
                </div>
                <div class="flex flex-row items-center pt-8 pb-20 w-full border-b">
                  <div class="flex items-start mx-auto">
                    <h4 class="font-semibold pt-2 pr-4 text-gray-700">Select user type *</h4>
                    <div class="flex flex-col space-y-5">
                      <div class="flex flex-row items-center space-x-3">
                        <input id="ussd" v-model="formStep1.user_type" value="ussd" name="user_type" class="border-gray-400 rounded-md" type="radio">
                        <label for="ussd" class="text-base text-gray-700 flex flex-col">
                          <span class="font-semibold">USSD access</span>
                          <span class="font-medium text-sm text-gray-500">For lending customers using USSD</span>
                        </label>
                      </div>
                      <div class="flex flex-row items-center space-x-3">
                        <input id="web" v-model="formStep1.user_type" value="web" name="user_type" class="border-gray-400 rounded-md" type="radio">
                        <label for="web" class="text-base text-gray-700 flex flex-col">
                          <span class="font-semibold">Web access</span>
                          <span class="font-medium text-sm text-gray-500">For lending organisation users</span>
                        </label>
                      </div>
<!--                      <small v-if="!vuelidateStep1.formStep1.user_type" class="text-pink-500 text-xs italic leading-tight -mt-2 block">Add the user type.</small>-->
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-6">
                    <div class="space-x-3">
                      <button @click="$router.push('users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="launchSpecific(currentStep+1)" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                enter-class="transform translate-x-full"
                enter-to-class="transform translate-x-0"
                leave-class="transform translate-x-0"
                leave-to-class="transform translate-x-full"
            >
              <div v-if="currentStep === 2" class="flex flex-col">
                <div class="flex flex-row justify-between pt-8 border-b pb-2">
                  <div class="font-medium text-lg text-gray-700">
                    <h3>Set user roles</h3>
                  </div>
                </div>
                <div class="flex flex-col pt-4">
                  <div class="flex">
                    <div :class="{ 'ring-2 bg-gray-50 ring-blue-300' : addRoleToUser }" class="flex-initial flex space-x-2 items-center py-4 px-3 rounded-md text-gray-700 text-base border cursor-pointer shadow" @click="addRoleToUser = !addRoleToUser">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p>Attach to existing roles</p>
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
                <div class="flex flex-row items-center pt-8 pb-20 w-full border-b">
                  <div class="flex items-start mx-auto">

                  </div>
                </div>
                <div class="flex">
                  <div class="ml-auto py-6">
                    <div class="space-x-3">
                      <button @click="$router.push('users')" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancel
                      </button>

                      <button @click="launchSpecific(currentStep+1)" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Next: permissions
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
