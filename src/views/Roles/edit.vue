<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ComputedRef, onMounted, reactive, ref } from "vue";
import { getRole } from "@/modules/all";
import { useStore } from "vuex";
import { RoleUsers } from "@/types/roleTypes";
import PermissionsExchange from "@/components/PermissionsExchange.vue";
import RolesExchange from "@/components/RolesExchange.vue";
import PermissionsList from "@/components/PermissionsList.vue";

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
    if (
      form.value.name.toLowerCase() === "sales_person" ||
      form.value.name.toLowerCase() === "relationship_manager"
    ) {
      form.value.name = form.value.name.toUpperCase();
    }
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
    /*const payload = {
      keycloakRoleId: form.value.keycloakRoleId,
      name: form.value.name,
      description: form.value.description,
    };*/
    const response = await store.dispatch("updateRole", form.value);
    await store.dispatch("defineNotification", {
      message: response.messages[0].message,
      success: true,
    });
    await loadPage();
  } catch (e: any) {
    await store.dispatch("defineNotification", {
      message: e.message,
      error: true,
    });
  } finally {
    loading.value = false;
  }
};
const addKeycloakIdsToAdd = async (ids: string[]) => {
  form.value.keycloakRoleIdsToRemove = [];
  form.value.keycloakRoleIdsToAdd = ids;
  if (
    form.value.name.toLowerCase() === "sales_person" ||
    form.value.name.toLowerCase() === "relationship_manager"
  ) {
    form.value.name = form.value.name.toUpperCase();
  }
  const response = await store.dispatch("updateRole", form.value);
  console.log("action update role", response);
  if (response && response.error) {
    await store.dispatch("defineNotification", {
      message: `${JSON.stringify(response)}`,
      error: true,
    });
  } else {
    await store.dispatch("defineNotification", {
      message: response.messages[0].message,
      success: true,
    });
  }
  form.value.keycloakRoleIdsToAdd = [];
  form.value.keycloakRoleIdsToRemove = [];
  await loadPage();
};

const addKeycloakIdsToRemove = async (ids: string[]) => {
  form.value.keycloakRoleIdsToAdd = [];
  form.value.keycloakRoleIdsToRemove = ids;
  if (
    form.value.name.toLowerCase() === "sales_person" ||
    form.value.name.toLowerCase() === "relationship_manager"
  ) {
    form.value.name = form.value.name.toUpperCase();
  }
  const response = await store.dispatch("updateRole", form.value);
  console.log("action update role", response);
  if (response && response.error) {
    await store.dispatch("defineNotification", {
      message: `${JSON.stringify(response)}`,
      error: true,
    });
  } else {
    await store.dispatch("defineNotification", {
      message: response.messages[0].message,
      success: true,
    });
  }
  form.value.keycloakRoleIdsToAdd = [];
  form.value.keycloakRoleIdsToRemove = [];
  await loadPage();
};
type ViewModeTypes = "description" | "permissions" | "users";
const viewMode = ref<ViewModeTypes>("description");
const setViewMode = (mode: ViewModeTypes) => {
  viewMode.value = mode;
};
function setPermissionToService(e: any, permission: permissionInterface) {
  if (e.target.checked) {
    form.value.keycloakRoleIdsToAdd.push(permission.keycloakRoleId);
  } else {
    const index = form.value.keycloakRoleIdsToAdd.findIndex(
      (item): boolean => item === permission.keycloakRoleId
    );
    form.value.keycloakRoleIdsToAdd.splice(index, 1);
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
    <div class="py-2 px-4 sm:p-6 sm:hidden">
      <div class="flex flex-col items-start space-y-1 mt-4">
        <button
          type="button"
          :class="{ 'bg-slate-50': viewMode === 'description' }"
          class="flex items-center py-2 px-0.5 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
          @click="setViewMode('description')"
        >
          1. Role Description
        </button>
        <button
          type="button"
          :class="{ 'bg-slate-50': viewMode === 'users' }"
          class="items-center py-2 px-0.5 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
          @click="setViewMode('users')"
        >
          2. Role Users
        </button>
      </div>
    </div>
    <form @submit.prevent="actionUpdateRole">
      <div class="relative z-0 flex flex-1 overflow-hidden">
        <main
          class="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last"
        >
          <!-- Main area -->
          <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <section>
              <div class="sm:overflow-hidden">
                <div class="py-2 px-4 sm:p-6">
                  <div v-if="viewMode === 'description'">
                    <h3 class="text-xl font-semibold text-gray-900">
                      Set role name and description
                    </h3>
                  </div>
                  <div v-if="viewMode === 'users'">
                    <h3 class="text-xl font-semibold text-gray-900">
                      Add role users
                    </h3>
                  </div>
                  <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div
                      v-if="viewMode === 'description'"
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
                      v-if="viewMode === 'description'"
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
                    <div v-if="viewMode === 'description'">
                      <h3 class="text-xl font-semibold text-gray-900">
                        Set role service permissions
                      </h3>
                    </div>
                    <div v-if="viewMode === 'description'">
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
                            :existing="keycloakIds"
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

                    <div
                      v-if="viewMode === 'users'"
                      class="border-t border-gray-200 pt-5"
                    >
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
        </main>
        <aside
          class="relative hidden w-52 flex-shrink-0 overflow-y-auto border-r border-gray-200 xl:order-first xl:flex xl:flex-col"
        >
          <!-- Secondary column (hidden on smaller screens) -->
          <div class="py-2 px-4 sm:p-6">
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Review description, permissions and role users.
            </p>
            <div class="block space-y-1 mt-4">
              <button
                type="button"
                :class="{ 'bg-slate-50': viewMode === 'description' }"
                class="flex items-center py-2 px-0.5 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                @click="setViewMode('description')"
              >
                1. Role Description
              </button>
              <button
                type="button"
                :class="{ 'bg-slate-50': viewMode === 'users' }"
                class="items-center py-2 px-0.5 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                @click="setViewMode('users')"
              >
                2. Role Users
              </button>
            </div>
          </div>
        </aside>
      </div>
      <div
        v-if="viewMode === 'description' || viewMode === 'permissions'"
        class="flex pb-20"
      >
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
              Update Role
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
