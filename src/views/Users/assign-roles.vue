<script setup lang="ts">
  import {useRoute, useRouter} from "vue-router"
  import { ref, onMounted } from "vue"
  import { useStore } from "vuex"

  const router = useRouter()

  const route = useRoute()

  const store = useStore()

  const userRoles = ref(<any[]>[])
  const userData = ref(<any>{})
  const userId = ref(null)
  const all_roles = ref(<{ id: string, keycloakRoleId: string, name: string, roleType: string, description: string }[]>[])

  const loading = ref(<boolean> false)

  const form = ref(<any> {
    roleIds: [],
  })

  onMounted(async () => {
    try {
      const { user } = await store.dispatch("getUser", route)

      userData.value = user

      const { data } = await store.dispatch("getUsersRoles", user.keycloakId)

      userRoles.value = data

      userRoles.value.map((rl: any) => {
        form.value.roleIds.push(rl.id)
      })

      userId.value = user.id

      const { records } = await store.dispatch("getRoles")

      all_roles.value = records

    } catch (e: any) {
      alert(e.message)
    }
  })

  const setRoleIds = ( e: any, id: any) => {
    if (e.target.checked) {
      form.value.roleIds.push(id)
      console.log(form.value.roleIds)
    } else {
      let index = form.value.roleIds.findIndex((roleId: any): boolean => roleId === id)
      form.value.roleIds.splice(index, 1)
      console.log(form.value.roleIds)
    }
  }

  const assignRoles = async () => {
    try {
      loading.value = true
      const { messages } = await store.dispatch("assignRoles", { userRefId: userId.value, payload: form.value })
      await store.dispatch("defineNotification", { message: messages[0].message, success: true })
      await router.push(`/admin/users/${route.params.id}`)
    } catch (e: any) {
      alert(e.message)
    } finally {
      loading.value = false
    }
  }

</script>
<template>
  <div class="w-full max-h-screen overflow-y-scroll">
    <form @submit.prevent="assignRoles">
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="shadow sm:overflow-hidden">
            <div class="bg-white py-6 px-4 sm:p-6">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Assign Roles
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Assign Roles to <span class="font-bold"> {{ userData.username }}</span>
                </p>
              </div>
              <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="email" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Email
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input disabled type="email" name="email" id="email" autocomplete="email" :value="userData.email" class="flex-1 bg-gray-50 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                    </div>
                  </div>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Roles
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg">
                      <fieldset class="space-y-5">
                        <legend class="sr-only">Roles</legend>
                        <div class="grid grid-cols-2 gap-4">
                          <div v-for="(role, i) in all_roles" :key="i" class="relative flex items-start">
                            <div class="flex items-center h-5">
                              <input @change="setRoleIds($event,role.id)" :id="`roles` + i" :checked="userRoles.findIndex(r => r.id === role.id) !== -1" aria-describedby="comments-description" name="userRoles[]" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            </div>
                            <div class="ml-3 text-sm">
                              <label :for="`roles` + i" class="font-medium text-gray-700">{{ role.name }}</label>
                              <p id="role_description" class="text-gray-500">{{ role.description }}</p>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="flex pb-20 bg-gray-100">
        <div class="ml-auto pt-5 pb-8 px-4">
          <div class="space-x-3">
            <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Save: User Roles
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
