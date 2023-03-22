<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { createRole, getServices } from "@/modules/all";
import PermissionsList from "@/components/PermissionsList.vue";
import PermissionsExchange from "@/components/PermissionsExchange.vue";
const store = useStore();
const router = useRouter();

interface permissionInterface {
  id: number;
  checked: boolean;
  name: string;
  description: string;
  keycloakRoleId: string;
  roleType: string;
  clientName: string;
  clientId: string;
}

interface serviceInterface {
  id: number;
  clientId: string;
  name: string;
  description: string;
  permissions: permissionInterface[];
}

interface formInterface {
  name: string;
  description: string;
  keycloakIds: string[];
}

const services = ref(<serviceInterface[]>[]);

store
  .dispatch("getServices")
  .then((response: serviceInterface[]) => {
    services.value = response.map((service: serviceInterface) => {
      return {
        ...service,
        checked: false,
      };
    });
  })
  .catch(e => {
    store.dispatch("defineNotification", { message: e.message, error: true });
  });

const form = ref(<formInterface>{
  name: "",
  description: "",
  keycloakIds: [],
});

const loading = ref(<boolean>false);

async function saveToState() {
  loading.value = true;
  console.log(form.value);
  try {
    if (
      form.value.name.toLowerCase() === "sales_person" ||
      form.value.name.toLowerCase() === "relationship_manager"
    ) {
      form.value.name = form.value.name.toUpperCase();
    }
    const response = await createRole(form.value);
    await store.dispatch("defineNotification", {
      message: response.message,
      success: true,
    });
    await router.push("/roles");
  } catch (e: any) {
    await store.dispatch("defineNotification", {
      message: e.message,
      error: true,
    });
  } finally {
    loading.value = false;
  }
}

function setPermissionToService(e: any, permission: permissionInterface) {
  if (e.target.checked) {
    form.value.keycloakIds.push(permission.keycloakRoleId);
  } else {
    const index = form.value.keycloakIds.findIndex(
      (item): boolean => item === permission.keycloakRoleId
    );
    form.value.keycloakIds.splice(index, 1);
  }
}
</script>
<template>
  <div class="w-full bg-white pb-24">
    <nav
      class="mt-4 flex px-5"
      aria-label="Breadcrumb"
    >
      <ol
        role="list"
        class="flex items-center space-x-4"
      >
        <li>
          <div class="flex items-center">
            <router-link
              :to="`/roles`"
              class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
              style="color: #9e9e9e"
            >
              All Roles
            </router-link>
          </div>
        </li>

        <li>
          <div class="flex items-center">
            <svg
              class="flex-shrink-0 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <h1
              class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
            >
              Create Role
            </h1>
          </div>
        </li>
      </ol>
    </nav>
    <form @submit.prevent="saveToState">
      <div class="relative z-0 flex flex-1 overflow-hidden mt-4">
        <main
          class="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last"
        >
          <!-- Main area -->
          <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <section>
              <div class="sm:overflow-hidden">
                <div class="py-2 px-4 sm:p-6">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900">
                      Create role name and description
                    </h3>
                  </div>
                  <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div
                      class="sm:grid sm:grid-cols-6 sm:gap-12 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                    >
                      <label
                        for="role_name"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Role name
                      </label>
                      <div class="col-span-5">
                        <div class="mt-1 sm:mt-0">
                          <div class="max-w-lg space-y-4">
                            <input
                              id="role_name"
                              v-model="form.name"
                              type="text"
                              name="role_name"
                              class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                              required
                            />

                            <div
                              v-show="
                                form.name.toLowerCase() === 'sales_person' ||
                                form.name.toLowerCase() ===
                                  'relationship_manager'
                              "
                              class="flex max-w-lg rounded-sm border p-2"
                              style="
                                background-color: #ffeeb3;
                                border-color: #fb6b27;
                              "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="mr-4 h-6 w-6"
                                style="color: #fb6b27"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                              </svg>
                              <div>
                                <p
                                  class="text-sm font-semibold lowercase"
                                  style="color: #fb6b27"
                                >
                                  {{ form.name }}
                                </p>
                                <p
                                  v-show="
                                    form.name.toLowerCase() === 'sales_person'
                                  "
                                  class="text-sm"
                                  style="color: #fb6b27"
                                >
                                  This role will limit all data access including
                                  loans and customer data to customers belonging
                                  to a sales person.
                                </p>
                                <p
                                  v-show="
                                    form.name.toLowerCase() ===
                                    'relationship_manager'
                                  "
                                  class="text-sm"
                                  style="color: #fb6b27"
                                >
                                  This role will limit all data access including
                                  loans and customer data to customers under a
                                  branch manager.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="sm:grid sm:grid-cols-6 sm:gap-12 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                    >
                      <label
                        for="description"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Description
                      </label>
                      <div class="col-span-5">
                        <div class="mt-1 sm:mt-0">
                          <textarea
                            id="description"
                            v-model="form.description"
                            rows="2"
                            class="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                          />
                          <p class="mt-2 text-sm text-gray-500">
                            Write a short description about the role.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900">
                        Set role service permissions
                      </h3>
                    </div>
                    <div>
                      <div
                        v-for="(service, i) in services"
                        :key="i"
                        class="col-span-1 sm:border-t sm:border-gray-200"
                      >
                        <div
                          class="p-1 bg-blue-50 flex items-center sm:mt-px sm:pt-2 space-x-2"
                        >
                          <div
                            class="block text-base font-medium text-gray-700"
                          >
                            {{ i + 1 }}.&nbsp;{{ service.clientId }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ service.description }}
                          </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                          <PermissionsList
                            v-for="(permission, index) in services[i]
                              .permissions"
                            :key="`${i}${index}`"
                            :existing="[]"
                            :permission="permission"
                            @change="setPermissionToService"
                          />
                          <div
                            v-if="services[i].permissions.length === 0"
                            class="flex items-center space-x-4 px-2 text-amber-700 py-6"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                              />
                            </svg>
                            <p>
                              No permissions available for
                              {{ service.clientId }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <div class="flex pb-20">
        <div class="ml-auto py-2 px-4 sm:p-6">
          <div class="space-x-3">
            <button
              type="submit"
              class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Create Role
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
