<script setup lang="ts">
  import { useRoute } from "vue-router"
  import { computed, reactive, ref } from "vue"
  import { getAccessToken, getUser } from '@/modules/all'
  import { useStore } from "vuex"

  const store = useStore()

  const organisation = computed(() => store.state.user ? store.state.user.companyName : null)

  const route = useRoute()

  const form = reactive({
    firstName: '',
    lastName: '',
    emailAddress: '',
    company: <any>'',
    phoneNumber: '',
    password: '',
    passwordConfirmation: ''
  })

  function editUser () {
    console.log("submission data", form)
  }

  const userData = ref({
    firstName: '',
    lastName: ''
  })

  getAccessToken()
  .then((token: string) => getUser(token, route))
  .then((user: {firstName: string, lastName: string, email: string, phoneNumber: string }) => {
    userData.value = {
      ...userData.value,
      ...user
    }
    console.log(user)
    form.firstName = user.firstName
    form.lastName = user.lastName
    form.emailAddress = user.email
    form.phoneNumber = user.phoneNumber
    form.company = organisation
  })
  .catch((e: any) => {
    console.log(e)
    alert("Get a valid 0auth2 token")
  })

</script>

<template>
  <div class="w-full">
    <div class="flex-col h-screen w-full overflow-y-auto" style="min-height: 640px;">
      <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
        <div class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200">
          <div class="flex-1 min-w-0">
            <div class="lg:ml-3 flex items-center border-b text-base border-gray-200">
              <router-link :to="`/profiles/${route.params.id}`" class="font-bold leading-7 text-teal-500 sm:leading-9 sm:truncate">
                {{ userData.firstName + ' ' + userData.lastName }} /
              </router-link>
              &nbsp;Profile edit
            </div>
            <div class="lg:ml-3 mt-4 text-sm block w-full lg:w-8/12">
              <form @submit.prevent="editUser" method="POST">

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
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="mt-1">
                      <input v-model="form.password" id="password" type="password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    </div>
                  </div>
                  <div>
                    <label for="password-confirmation" class="block text-sm font-medium text-gray-700">Password confirmation</label>
                    <div class="mt-1">
                      <input v-model="form.passwordConfirmation" id="password-confirmation" type="password" class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    </div>
                  </div>
                </div>
                <div class="flex w-full">
                  <button type="submit" class="block ml-auto max-w-md py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mt-4 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50">
                    Save user
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
