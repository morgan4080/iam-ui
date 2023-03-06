<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ComputedRef, onMounted, reactive, ref } from "vue";
import { getRole } from "@/modules/all";
import { useStore } from "vuex";
import { RoleUsers } from "@/types/roleTypes";
import PermissionsExchange from "@/components/PermissionsExchange.vue";
import RolesExchange from "@/components/RolesExchange.vue";

const route = useRoute();
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
  keycloakRoleId: string;
  name: string;
  description: string;
  keycloakRoleIdsToAdd: string[];
  keycloakRoleIdsToRemove: string[];
}

const currentPage = ref(<number>1);

const filterForm = reactive({
  recordsPerPage: 10,
  searchTerm: "",
  order: "ASC",
  page: currentPage.value,
});

const urlParams = new URLSearchParams();

if (filterForm.searchTerm !== "") {
  urlParams.set("searchTerm", filterForm.searchTerm);
}

urlParams.set("order", filterForm.order);
urlParams.set("sort", filterForm.order);
urlParams.set("pageSize", `${filterForm.recordsPerPage}`);
urlParams.set("pageIndex", `${currentPage.value - 1}`);

const query = computed(() => urlParams.toString());

const services = ref(<serviceInterface[]>[]);

const role = ref(<any>{});
const keycloakIds = ref(<string[]>[]);
const initialKeycloakIds = new Set<string>();

const form = ref(<formInterface>{
  keycloakRoleId: role.value.keycloakRoleId,
  name: "",
  description: "",
  keycloakRoleIdsToAdd: [],
  keycloakRoleIdsToRemove: [],
});

const selectedService = ref<number | null>(null);

const roleUsers: ComputedRef<RoleUsers[]> = computed(() => {
  return store.getters.getRoleUsers;
});

const loadPage = async () => {
  try {
    services.value = await store.dispatch("getServices");

    role.value = await getRole(route.params.id);

    form.value.name = role.value.name;
    form.value.keycloakRoleId = role.value.keycloakRoleId;

    form.value.description = role.value.description
      ? role.value.description
      : "";

    if (role.value.services) {
      keycloakIds.value = role.value.services
        .map((service: any) => {
          return service.permissions.map((permission: any) => {
            return permission.keycloakRoleId;
          });
        })
        .reduce((acc: [], curr: []) => {
          acc = [...acc, ...curr];
          return acc;
        }, []);

      form.value.keycloakRoleIdsToAdd = keycloakIds.value;

      keycloakIds.value.forEach((key: string) => {
        initialKeycloakIds.add(key);
      });
    }
  } catch (e: any) {
    await store.dispatch("defineNotification", {
      message: e.message,
      error: true,
    });
  }

  try {
    await store.dispatch("fetchRoleUsers", route.params.id);
  } catch (e: any) {
    if (e.message) {
      await store.dispatch("defineNotification", {
        message: e.message,
        error: true,
      });
    } else {
      console.warn("fetchRoleUsers", e);
    }
  }

  try {
    await store.dispatch("getUsers", `?${query.value}`);
  } catch (e: any) {
    if (e.message) {
      await store.dispatch("defineNotification", {
        message: e.message,
        error: true,
      });
    } else {
      console.warn("fetchRoleUsers", e);
    }
  }
};

onMounted(async () => {
  await loadPage();
});

const loading = ref(<boolean>false);

const actionUpdateRole = async () => {
  try {
    loading.value = true;

    // suspect

    const existing: string[] = Array.from(initialKeycloakIds);
    form.value.keycloakRoleIdsToRemove = existing.reduce(
      (acc: string[], current: string) => {
        if (
          form.value.keycloakRoleIdsToAdd.findIndex(
            (k: string) => k === current
          ) === -1
        ) {
          acc.push(current);
        }
        return acc;
      },
      []
    );
    form.value.keycloakRoleIdsToAdd = form.value.keycloakRoleIdsToAdd.filter(
      (keyId: string) => existing.indexOf(keyId) === -1
    );

    // suspect

    if (
      form.value.name.toLowerCase() === "sales_person" ||
      form.value.name.toLowerCase() === "relationship_manager"
    ) {
      form.value.name = form.value.name.toUpperCase();
    }
    const response = await store.dispatch("updateRole", form.value);
    await store.dispatch("defineNotification", {
      message: response.messages[0].message,
      success: true,
    });
    await router.push(`/roles`);
  } catch (e: any) {
    await store.dispatch("defineNotification", {
      message: e.message,
      error: true,
    });
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="w-full max-h-screen overflow-y-scroll pb-24">
    <form @submit.prevent="actionUpdateRole">
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="bg-white shadow sm:overflow-hidden">
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
                      :to="`/roles/${route.params.id}`"
                      class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                      style="color: #9e9e9e"
                    >
                      Role
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
                      Update Role
                    </h1>
                  </div>
                </li>
              </ol>
            </nav>
            <div class="py-2 px-4 sm:p-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Edit Role</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Add new permissions
                </p>
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
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
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
                          form.name.toLowerCase() === 'relationship_manager'
                        "
                        class="flex max-w-lg rounded-sm border p-2"
                        style="background-color: #ffeeb3; border-color: #fb6b27"
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
                            v-show="form.name.toLowerCase() === 'sales_person'"
                            class="text-sm"
                            style="color: #fb6b27"
                          >
                            This role will limit all data access including loans
                            and customer data to customers belonging to a sales
                            person.
                          </p>
                          <p
                            v-show="
                              form.name.toLowerCase() === 'relationship_manager'
                            "
                            class="text-sm"
                            style="color: #fb6b27"
                          >
                            This role will limit all data access including loans
                            and customer data to customers under a branch
                            manager.
                          </p>
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
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
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
                <div
                  class="sm:grid sm:grid-cols-6 sm:gap-12 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Services
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      v-model="selectedService"
                      class="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                    >
                      <option :value="null">Select Service</option>
                      <option
                        v-for="(service, i) in services"
                        :key="i"
                        :value="i"
                      >
                        {{ service.clientId }}
                        <!--{{service.name ? `: ${service.name}` : ``}}-->
                      </option>
                    </select>
                    <p class="mt-2 text-sm text-gray-500">
                      Select a service to start assigning permissions to this
                      role.
                    </p>
                  </div>
                </div>

                <div
                  v-if="typeof selectedService === 'number'"
                  class="sm:grid sm:grid-cols-6 sm:gap-12 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Service Permissions
                  </label>

                  <PermissionsExchange
                    :existing="keycloakIds"
                    :role_name="form.name"
                    :selected-service="selectedService"
                    :services="services"
                  />
                </div>

                <div
                  class="sm:grid sm:grid-cols-6 sm:gap-12 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Role Users
                  </label>
                  <RolesExchange
                    :role="role"
                    :role-users="roleUsers"
                    :load-page="loadPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="flex pb-20 bg-gray-100">
        <div class="ml-auto pt-5 pb-8 px-4">
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
              Update: Role
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
