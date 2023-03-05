<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { getUsersRoles } from "@/modules/all";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();

const route = useRoute();

const store = useStore();

const userRoles = ref(<any[]>[]);
const userData = ref(<any>{});
const userId = ref(null);
const all_roles = ref(
  <
    {
      id: string;
      keycloakRoleId: string;
      name: string;
      roleType: string;
      description: string;
    }[]
  >[]
);

const loading = ref(<boolean>false);

const form = ref(<any>{
  roleIds: [],
});

onMounted(async () => {
  try {
    const { user } = await store.dispatch("getUser", route);

    userData.value = user;

    const { data } = await getUsersRoles(user.keycloakId);

    userRoles.value = data;

    userRoles.value.map((rl: any) => {
      form.value.roleIds.push(rl.id);
    });

    userId.value = user.id;

    const { records } = await store.dispatch("getRoles");

    all_roles.value = records;
  } catch (e: any) {
    alert(e.message);
  }
});

const setRoleIds = (e: any, id: any) => {
  if (e.target.checked) {
    form.value.roleIds.push(id);
    console.log(form.value.roleIds);
  } else {
    let index = form.value.roleIds.findIndex(
      (roleId: any): boolean => roleId === id
    );
    form.value.roleIds.splice(index, 1);
    console.log(form.value.roleIds);
  }
};

const assignRoles = async () => {
  try {
    loading.value = true;
    const { messages } = await store.dispatch("assignRoles", {
      userRefId: userId.value,
      payload: form.value,
    });
    await store.dispatch("defineNotification", {
      message: messages[0].message,
      success: true,
    });
    await router.push(`/users/${route.params.id}`);
  } catch (e: any) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
};

const idsToAddToUser = ref<string[]>([]);

const setRoleIdsToAddToUser = (e: any, roleId: string) => {
  if (e.target.checked) {
    idsToAddToUser.value.push(roleId);
  } else {
    let index = idsToAddToUser.value.findIndex(
      (id: string): boolean => id === roleId
    );
    idsToAddToUser.value.splice(index, 1);
  }
};

const idsToRemoveFromUser = ref<string[]>([]);

const setRoleIdsToRemoveFromUser = (e: any, roleId: string) => {
  if (e.target.checked) {
    idsToRemoveFromUser.value.push(roleId);
  } else {
    let index = idsToRemoveFromUser.value.findIndex(
      (id: string): boolean => id === roleId
    );
    idsToRemoveFromUser.value.splice(index, 1);
  }
};

const filteredRoles = computed(() => {
  // remove from allUsers, users present in roleUsers
  const userRolesIds = userRoles.value.map(role => role.id);

  return all_roles.value.reduce((acc: typeof all_roles.value, role) => {
    if (userRolesIds.indexOf(role.id) === -1) {
      acc.push(role);
    }
    return acc;
  }, []);
});

const addRolesToUser = async () => {
  if (idsToAddToUser.value.length === 0) {
    await store.dispatch("defineNotification", {
      message: "Use the checkbox to select roles to remove",
      warning: true,
    });
  } else {
    if (
      confirm(
        `You are about to add ${idsToAddToUser.value.length} roles from user ${userData.value.username}, proceed?`
      )
    ) {
      try {
        loading.value = true;
        const userRoleIds = userRoles.value.map(role => role.id);
        const { messages } = await store.dispatch("assignRoles", {
          userRefId: userId.value,
          payload: {
            roleIds: [...userRoleIds, ...idsToAddToUser.value],
          },
        });
        await store.dispatch("defineNotification", {
          message: messages[0].message,
          success: true,
        });
        await router.push(`/users/${route.params.id}`);
      } catch (e: any) {
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }
  }
};

const removeRolesFromUser = async () => {
  if (idsToRemoveFromUser.value.length === 0) {
    await store.dispatch("defineNotification", {
      message: "Use the checkbox to select roles to remove",
      warning: true,
    });
  } else {
    if (
      confirm(
        `You are about to remove ${idsToRemoveFromUser.value.length} roles from user ${userData.value.username}, proceed?`
      )
    ) {
      const userRolesIds = userRoles.value.map(role => role.id);
      const newRoleIds = userRolesIds.filter(
        role_id => idsToRemoveFromUser.value.indexOf(role_id) === -1
      );
      try {
        loading.value = true;
        const { messages } = await store.dispatch("assignRoles", {
          userRefId: userId.value,
          payload: {
            roleIds: newRoleIds,
          },
        });
        await store.dispatch("defineNotification", {
          message: messages[0].message,
          success: true,
        });
        await router.push(`/users/${route.params.id}`);
      } catch (e: any) {
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }
  }
};
</script>
<template>
  <div class="w-full max-h-screen overflow-y-scroll">
    <form @submit.prevent="assignRoles">
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="bg-white shadow sm:overflow-hidden">
            <div class="ml-5 py-3 flex items-center border-b border-gray-200">
              <nav
                class="flex"
                aria-label="Breadcrumb"
              >
                <ol
                  role="list"
                  class="flex items-center space-x-4"
                >
                  <li>
                    <div class="flex items-center">
                      <router-link
                        :to="`/users/${route.params.id}`"
                        class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                        style="color: #9e9e9e"
                      >
                        User Profile
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
                        Assign Roles
                      </h1>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div class="py-2 px-4 sm:p-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Assign Roles
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Assign Roles to
                  <span class="font-bold"> {{ userData.username }}</span>
                </p>
              </div>
              <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div
                  class="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Email
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        id="email"
                        disabled
                        type="email"
                        name="email"
                        :value="userData.email"
                        class="flex-1 bg-gray-50 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 col-span-1"
                  >
                    Roles
                  </label>
                  <div class="flex items-start col-span-2">
                    <div class="mt-1 sm:mt-0 flex-1">
                      <div
                        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                      >
                        <p
                          class="-mt-1 mb-2 text-sm font-medium text-gray-700 bg-gray-100"
                        >
                          Available Roles
                        </p>
                        <ul class="list-decimal list-inside space-y-2">
                          <li
                            v-for="(role, index) in filteredRoles"
                            :key="index"
                            class="flex items-center justify-between"
                          >
                            <label :for="index">
                              {{ role.name }}
                            </label>
                            <input
                              :id="index"
                              type="checkbox"
                              class="text-xs text-gray-500"
                              @change="setRoleIdsToAddToUser($event, role.id)"
                            >
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="flex flex-col items-center space-y-3 my-2">
                      <button
                        type="button"
                        class="mx-4"
                        @click="addRolesToUser"
                      >
                        <ArrowRightCircleIcon class="w-6 h-6" />
                      </button>

                      <button
                        type="button"
                        class="mx-4"
                        @click="removeRolesFromUser"
                      >
                        <ArrowLeftCircleIcon class="w-6 h-6" />
                      </button>
                    </div>

                    <div class="mt-1 sm:mt-0 flex-1">
                      <div
                        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                      >
                        <p
                          class="-mt-1 mb-2 text-sm font-medium text-gray-700 bg-gray-100"
                        >
                          Roles Associated To {{ userData.username }}
                        </p>
                        <ul class="list-decimal list-inside space-y-2">
                          <li
                            v-for="(role, index) in userRoles"
                            :key="index"
                            class="flex items-center justify-between"
                          >
                            <label :for="index">
                              {{ role.name }}
                            </label>
                            <input
                              :id="index"
                              type="checkbox"
                              class="text-xs text-gray-500"
                              @change="
                                setRoleIdsToRemoveFromUser($event, role.id)
                              "
                            >
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <!--                  <div
                    class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 col-span-2"
                  >
                    <div
                      class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                    >
                      <div
                        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                      >
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Select
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Role
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(role, i) in all_roles"
                              :key="role.id"
                              :class="{
                                'bg-white': i % 2 === 0,
                                'bg-gray-50': i % 2 !== 0,
                              }"
                            >
                              <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                              >
                                <input
                                  @change="setRoleIds($event, role.id)"
                                  :id="`roles` + i"
                                  :checked="
                                    userRoles.findIndex(
                                      r => r.id === role.id
                                    ) !== -1
                                  "
                                  name="userRoles[]"
                                  class="border-gray-400 rounded-md"
                                  type="checkbox"
                                />
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                              >
                                {{ role.name }}
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              >
                                {{
                                  role.description
                                    ? role.description
                                    : "customer or admin role description"
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!--      <div class="flex pb-20 bg-gray-100">
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
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Save: User Roles
            </button>
          </div>
        </div>
      </div>-->
    </form>
  </div>
</template>
