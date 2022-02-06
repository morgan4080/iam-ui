<script setup lang="ts">
  import {useRoute} from "vue-router"
  import {ref, computed} from "vue"
  import {getUser, getUsersRoles, passChange, passReset} from '@/modules/all'
  import { useStore } from "vuex"

  const route = useRoute()

  const store = useStore()

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
  const payload = {
    "userRefId": userData.value.keycloakId,
    "email": userData.value.email,
    "newPassword": form.value.password,
    "confirmPassword": form.value.passwordConfirmation
  }

  async function changePassword() {
    try {
      const response = await passChange(payload)
      console.log(response)
    } catch (e: any) {
      alert(e.message)
    }
  }
</script>
<template>

    <div class="w-full lg:max-w-6xl max-h-screen overflow-y-scroll">
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <form @submit.prevent="changePassword">
          <section>
            <div class="shadow sm:overflow-hidden">
              <div class="bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Change Password
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Provide a new password for user: {{ userData.username }}
                  </p>
                </div>
                <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Password
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="max-w-lg flex rounded-md shadow-sm">
                        <input v-model="form.name" type="text" name="username" id="username" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                      </div>
                    </div>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="description" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Password Confirmation
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <textarea v-model="form.description" id="description" rows="3" class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md" required></textarea>
                      <p class="mt-2 text-sm text-gray-500">Write a short description about the role.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>

</template>
