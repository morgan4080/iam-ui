<script setup lang="ts">
  import { ref } from "vue"
  import { useStore } from "vuex"
  import {createRole, getServices} from '@/modules/all'
  import PermissionsList from '@/components/PermissionsList.vue'
  const store = useStore()

  interface permissionInterface { id: number, checked: boolean, name: string, description: string, keycloakRoleId: string, roleType: string, clientName: string, clientId: string }

  interface serviceInterface { id: number, clientId: string, name: string, description: string, permissions: permissionInterface[]}

  interface formInterface { name: string, description: string, services: serviceInterface[] }

  const services = ref(< serviceInterface []>
    [
      {
        id: 1,
        name: 'Presta Lending',
        description: 'Kopesha, leding services',
        permissions: [
          {
            id: 1,
            checked: false,
            name: "Full kopesha access",
            description: "full service access"
          },
          {
            id: 2,
            checked: false,
            name: "Read kopesha access",
            description: "Read service access"
          },
          {
            id: 3,
            checked: false,
            name: "Write kopesha access",
            description: "Write service access"
          }
        ]
      },
      {
        id: 2,
        name: 'E-guarantorship',
        description: 'Manage loan guarantor-ship',
        permissions: [
          {
            id: 1,
            checked: false,
            name: "Full guarantorship access",
            description: "full service access"
          },
          {
            id: 2,
            checked: false,
            name: "Read guarantorship access",
            description: "Read service access"
          },
          {
            id: 3,
            checked: false,
            name: "Write guarantorship access",
            description: "Write service access"
          }
        ]
      },
      {
        id: 3,
        name: 'B2C',
        description: 'Business to customer service',
        permissions: [
          {
            id: 1,
            checked: false,
            name: "Full b2c access",
            description: "full service access"
          },
          {
            id: 2,
            checked: false,
            name: "Read b2c access",
            description: "Read service access"
          },
          {
            id: 3,
            checked: false,
            name: "Write b2c access",
            description: "Write service access"
          }
        ]
      },
      {
        id: 4,
        name: 'C2B',
        description: 'customer to business service',
        permissions: [
          {
            id: 1,
            checked: false,
            name: "Full c2b access",
            description: "full service access"
          },
          {
            id: 2,
            checked: false,
            name: "Read c2b access",
            description: "Read service access"
          },
          {
            id: 3,
            checked: false,
            name: "Write c2b access",
            description: "Write service access"
          }
        ]
      },
      {
        id: 5,
        name: 'Easy USSD',
        description: 'Create ussd solutions',
        permissions: [
          {
            id: 1,
            checked: false,
            name: "Full ussd access",
            description: "full service access"
          },
          {
            id: 2,
            checked: false,
            name: "Read ussd access",
            description: "Read service access"
          },
          {
            id: 3,
            checked: false,
            name: "Write ussd access",
            description: "Write service access"
          }
        ]
      }
    ]
  )

  /*getServices()
      .then((response: serviceInterface[]) => {
        services.value = response.map((service: serviceInterface) => {
          return {
            ...service,
            checked: false
          }
        })
      }).catch(e => {
    store.dispatch("defineNotification", { message: e.message, error: true })
  })*/

  const form = ref(< formInterface >
    {
      name: "",
      description: "",
      services: []
    }
  )

  const currentServiceIndex = ref(<number> 0)

  const reviewed = ref(<boolean> false)

  function displayService(servicesIndex: number) {
    currentServiceIndex.value = servicesIndex
  }

  function addServiceToForm(e: any, service: serviceInterface) {
    if (e.target.checked) {
      let serviceCast: { clientId: string, id: number, name: string, description: string, permissions: permissionInterface[] } = {
        clientId: service.clientId,
        id: service.id,
        name: service.name,
        description: service.description,
        permissions: []
      }
      form.value.services.push(serviceCast)
    } else {
      let index = form.value.services.findIndex((item): boolean => item.id === service.id)
      form.value.services.splice(index, 1)
    }
    console.log(form.value.services)
  }

  function setPermissionToService(e: any, permission: permissionInterface, serviceIndex: number = currentServiceIndex.value) {
    console.log(serviceIndex)
    if (form.value.services[serviceIndex]) {
      if (e.target.checked) {
        form.value.services[serviceIndex].permissions.push(permission)
      } else {
        let index = form.value.services[serviceIndex].permissions.findIndex((item): boolean => item.id === permission.id)
        form.value.services[serviceIndex].permissions.splice(index, 1)
      }
      console.log(form.value.services[serviceIndex])
    } else {
      e.target.checked = false
      store.dispatch("defineNotification", { message: "Choose a service first", warning: true })
    }
  }

  function saveToState() {
    console.log("request payload", form.value)
    createRole(form.value)
        .then(response => {
          store.dispatch("defineNotification", response.message)
        })
        .catch(e => {
          store.dispatch("defineNotification", e.message)
        })
  }

</script>
<template>
  <div class="w-full lg:max-w-6xl max-h-screen overflow-y-scroll">
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
                        <input v-model="form.name" type="text" name="username" id="username" autocomplete="username" class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300">
                      </div>
                    </div>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="description" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Description
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <textarea v-model="form.description" id="description" rows="3" class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"></textarea>
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
                <div class="mt-6 pb-12 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-12">
                  <fieldset class="border-t border-b border-gray-200">
                    <legend class="sr-only">Notifications</legend>
                    <div class="divide-y divide-gray-200">
                      <div @click="displayService(i)" v-for="(service, i) in services" :key="i" :class="{'bg-blue-50 relative ' : currentServiceIndex === i }" class="relative flex items-center px-2 py-4 cursor-pointer">
                        <div class="min-w-0 flex-1 text-sm">
                          <label :for="`service${service.id}`" class="font-medium text-gray-700">{{ service.name }}</label>
                          <p id="comments-description" class="text-gray-500">{{ service.description }}</p>
                        </div>
                        <div class="ml-3 flex items-center h-5">
                          <input @change="addServiceToForm($event,service)" :id="`service${service.id}`" aria-describedby="service-selector" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                        </div>
                        <div v-if="currentServiceIndex === i" class="absolute top-0 -right-9">
                          <div class="w-0 h-0" style="border-top: 36px solid transparent;border-bottom: 36px solid transparent;border-left: 36px solid rgba(240, 249, 255, 1);"></div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <div class="relative">
                    <h6 class="absolute -top-10 text-sm text-gray-500">Permissions</h6>
                    <fieldset class="bg-blue-50 px-2 border-t border-b border-gray-200">
                      <legend class="sr-only">Permissions</legend>
                      <div class="divide-y divide-gray-200">
                        <PermissionsList v-for="(permission, i) in services[currentServiceIndex].permissions" :key="`${currentServiceIndex}${i}`"  :permission="permission" @change="setPermissionToService"/>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>


        <div v-if="reviewed" class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <section>
            <div class="shadow sm:overflow-hidden">
              <div class="bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Review Role
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Review the role. After you create the role, you can assign it to new or existing users.
                  </p>
                </div>
                <div class="mt-5 border-t border-gray-200">
                  <dl class="sm:divide-y sm:divide-gray-200">
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">
                        Role name
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ form.name }}
                      </dd>
                    </div>
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">
                        Role description
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ form.description }}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div class="mt-10 divide-y divide-gray-200">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Review Services
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                      Assign service permissions to role.
                    </p>
                  </div>
                </div>
                <div class="mt-5 border-t border-gray-200">
                  <dl class="sm:divide-y sm:divide-gray-200">
                    <div v-for="(service, i) in form.services" :key="i" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">
                        {{ service.name }}
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                        <div class="flex-grow">{{ service.description }}</div>
                        <ol class="ml-12 flex-shrink-0 list-disc">
                          <li v-for="(permission, i) in service.permissions" :key="i">{{ permission.name }}</li>
                        </ol>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>
        </div>



      <div v-if="!reviewed" class="flex pb-20 bg-gray-100">
        <div class="ml-auto pt-5 pb-8 px-4">
          <div class="space-x-3">
            <button type="button" @click="reviewed = true" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">Review: Role</button>
          </div>
        </div>
      </div>

      <div v-else class="flex pb-20 bg-gray-100">
        <div class="ml-auto pt-5 pb-8 px-4">
          <div class="space-x-3">
            <button @click="reviewed = false" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"> Cancel </button>
            <button type="submit" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">Submit: Role</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
