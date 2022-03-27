<script setup lang="ts">
  import { ref } from "vue"
  import { useStore } from "vuex"
  import { useRouter } from "vue-router"
  import {createRole, getServices} from '@/modules/all'
  import PermissionsList from '@/components/PermissionsList.vue'
  const store = useStore()
  const router = useRouter()

  interface permissionInterface { id: number, checked: boolean, name: string, description: string, keycloakRoleId: string, roleType: string, clientName: string, clientId: string }

  interface serviceInterface { id: number, clientId: string, name: string, description: string, permissions: permissionInterface[]}

  interface formInterface { name: string, description: string, keycloakIds: string[] }

  const services = ref(< serviceInterface []>
    [

    ]
  )

  getServices()
      .then((response: serviceInterface[]) => {
        services.value = response.map((service: serviceInterface) => {
          return {
            ...service,
            checked: false
          }
        })
      }).catch(e => {
    store.dispatch("defineNotification", { message: e.message, error: true })
  })

  const form = ref(< formInterface >
    {
      name: "",
      description: "",
      keycloakIds: []
    }
  )

  const reviewed = ref(<boolean> false)

  function setPermissionToService(e: any, permission: permissionInterface) {
    if (e.target.checked) {
      form.value.keycloakIds.push(permission.keycloakRoleId)
    } else {
      let index = form.value.keycloakIds.findIndex((item): boolean => item === permission.keycloakRoleId)
      form.value.keycloakIds.splice(index, 1)
    }
  }
  const loading = ref(<boolean> false)

  async function saveToState() {
    loading.value = true
    try {
      const response = await createRole(form.value)
      await store.dispatch("defineNotification", { message: response.message, success: true })
      await router.push('/admin/roles')
    } catch (e: any) {
      await store.dispatch("defineNotification", { message: e.message, error: true })
    } finally {
      loading.value = false
    }
  }

</script>

<template>
  <div class="w-full max-h-screen overflow-y-scroll">
    <form @submit.prevent="saveToState">

      <div v-if="!reviewed" class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="shadow sm:overflow-hidden">
            <div class="bg-white py-6 px-4 sm:p-6">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Create Role
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  This information will be used configure service permissions.
                </p>
              </div>
              <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Role name
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input v-model="form.name" type="text" name="username" id="username" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300" required>
                    </div>
                  </div>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="description" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Description
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea v-model="form.description" id="description" rows="3" class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md" required></textarea>
                    <p class="mt-2 text-sm text-gray-500">Write a short description about the role.</p>
                  </div>
                </div>
              </div>
              <div class="mt-10 divide-y divide-gray-200">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Services
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Assign service permissions to role.
                  </p>
                </div>
              </div>

              <div class="mt-3">
                <div v-for="(service, i) in services" :key="i" class="col-span-1 sm:border-t sm:border-gray-200">
                  <div class="p-1 bg-blue-50 flex items-center sm:mt-px sm:pt-2 space-x-2">
                    <div class="block text-base font-medium text-gray-700">{{ i+1 }}.&nbsp;{{ service.name }}</div>
                    <div class="text-xs text-gray-500">
                      {{ service.description }}
                    </div>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <PermissionsList v-for="(permission, index) in services[i].permissions" :key="`${i}${index}`" :permission="permission" @change="setPermissionToService"/>
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
              Save: Role
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
