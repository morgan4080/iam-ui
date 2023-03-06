<template>
  <div class="flex items-start col-span-4">
    <div class="mt-1 sm:mt-0 flex-1">
      <div
        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
      >
        <div
          class="-mt-1 capitalize mb-2 text-sm font-medium text-gray-700 space-y-2"
        >
          <div class="bg-gray-100">Available Users</div>
          <div class="flex rounded-md shadow-sm">
            <div class="relative flex focus-within:z-10">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <MagnifyingGlassIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                v-model="pageables.searchTerm"
                type="search"
                name="search"
                class="block rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Search term"
                @change="searchUsers"
              />
            </div>
            <button
              type="button"
              class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              @click="sortUsers"
            >
              <BarsArrowUpIcon
                v-if="pageables.sort === 'ASC'"
                class="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <BarsArrowDownIcon
                v-if="pageables.sort === 'DESC'"
                class="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />

              Sort
            </button>
          </div>
        </div>
        <ul class="list-decimal list-inside space-y-2">
          <li
            v-for="(user, index) in filteredUsers"
            :key="index"
            class="flex items-center justify-between"
          >
            <label :for="`${index}${user.id}`">
              {{ user.firstName }} {{ user.lastName }}
            </label>
            <input
              :id="`${index}${user.id}`"
              type="checkbox"
              class="text-xs text-gray-500"
              @change="setUserIdsToAddToRole($event, user.id)"
            />
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col items-center space-y-3 my-2">
      <button
        :disabled="filteredUsers.length === 0"
        type="button"
        class="mx-4"
        :class="{
          'cursor-not-allowed': filteredUsers.length === 0,
        }"
        @click="addUsersToRole"
      >
        <ArrowRightCircleIcon class="w-6 h-6" />
      </button>

      <button
        :disabled="roleUsers.length === 0"
        type="button"
        class="mx-4"
        :class="{
          'cursor-not-allowed': roleUsers.length === 0,
        }"
        @click="removeUsersFromRole"
      >
        <ArrowLeftCircleIcon class="w-6 h-6" />
      </button>
    </div>

    <div class="mt-1 sm:mt-0 flex-1">
      <div
        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
      >
        <p
          class="-mt-1 capitalize mb-2 text-sm font-medium text-gray-700 bg-gray-100"
        >
          Users Associated To Role {{ role.name }}
        </p>
        <ul class="list-decimal list-inside space-y-2">
          <li
            v-for="(user, index) in roleUsers"
            :key="index"
            class="flex items-center justify-between"
          >
            <label :for="`${index}${user.id}`">
              {{ user.firstName }} {{ user.lastName }}
            </label>
            <input
              :id="`${index}${user.id}`"
              type="checkbox"
              class="text-xs text-gray-500"
              @change="setUserIdsToRemoveFromRole($event, user.keycloakId)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import { computed, ComputedRef, reactive, ref, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
type RoleUsers = {
  keycloakId: string;
  isEnabled: boolean;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  ussdPhoneNumber: string;
  id: string;
}[];

const props = defineProps<{
  role: any;
  roleUsers: RoleUsers;
  loadPage: () => Promise<void>;
}>();

const { roleUsers, role, loadPage } = toRefs(props);

const pageables = reactive({
  recordsPerPage: 10,
  totalRecords: 0,
  totalPages: 0,
  currentPage: 0,
  sort: "ASC",
  searchTerm: "",
});

const allUsers: ComputedRef<
  {
    keycloakId: string;
    isEnabled: boolean;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    ussdPhoneNumber: string;
    id: string;
  }[]
> = computed(() => {
  return store.getters.getAllUsers;
});

const idsToAddToRole = ref<Set<string>>(new Set());

const setUserIdsToAddToRole = (e: Event, refId: string) => {
  const isChecked = (<HTMLInputElement>e.target).checked;
  if (e.target && isChecked) {
    idsToAddToRole.value.add(refId);
  } else {
    idsToAddToRole.value.delete(refId);
    console.log(idsToAddToRole.value);
  }
};

const idsToRemoveFromRole = ref<Set<string>>(new Set());

const setUserIdsToRemoveFromRole = (e: Event, keycloakId: string) => {
  const isChecked = (<HTMLInputElement>e.target).checked;
  if (e.target && isChecked) {
    idsToRemoveFromRole.value.add(keycloakId);
  } else {
    idsToRemoveFromRole.value.delete(keycloakId);
    console.log(idsToRemoveFromRole.value);
  }
};

const removeUsersFromRole = async () => {
  const roleUsersKeycloakIds = roleUsers.value.map(user => user.keycloakId);
  if (
    roleUsersKeycloakIds.length === idsToRemoveFromRole.value.size &&
    role.value.name.toUpperCase() === "ADMIN"
  ) {
    alert("You cannot remove all users from role: " + role.value.name);
    return;
  }
  if (idsToRemoveFromRole.value.size === 0) {
    await store.dispatch("defineNotification", {
      message: "Use the checkbox to select users to remove",
      warning: true,
    });
  } else {
    if (
      confirm(
        `You are about to remove ${idsToRemoveFromRole.value.size} users from role ${role.value.name}, proceed?`
      )
    ) {
      try {
        // call action to update role users
        const response = await store.dispatch("deleteUsersInRole", {
          role_id: role.value.id,
          userKeyCloakIds: Array.from(idsToRemoveFromRole.value),
        });
        console.log("removeUsersFromRole", response);
        if (response && response.error) {
          await store.dispatch("defineNotification", {
            message: `${JSON.stringify(response)}`,
            error: true,
          });
        } else {
          await store.dispatch("defineNotification", {
            message: `Removed ${idsToRemoveFromRole.value.size} users from role ${role.value.name} successfully`,
            success: true,
          });
        }
        // reload onMounted
        await loadPage.value();
      } catch (e: any) {
        if (e.message) {
          await store.dispatch("defineNotification", {
            message: e.message,
            error: true,
          });
        } else {
          console.warn("removeUsersFromRole", e);
        }
      }
    }
  }
};

const addUsersToRole = async () => {
  if (idsToAddToRole.value.size === 0) {
    await store.dispatch("defineNotification", {
      message: "Use the checkbox to select users to add",
      warning: true,
    });
  } else {
    if (
      confirm(
        `You are about to add ${idsToAddToRole.value.size} users to role ${role.value.name}, proceed?`
      )
    ) {
      try {
        // call action to update role users
        // map role users to return keycloak id only
        // spread role users keycloak ids and keycloak idsToAddToRole
        const roleUsersIds = roleUsers.value.map(user => user.id);
        console.log([...roleUsersIds, ...idsToAddToRole.value]);
        const response = await store.dispatch("updateUsersInRole", {
          role_id: route.params.id,
          userRefIds: [...roleUsersIds, ...Array.from(idsToAddToRole.value)],
        });
        console.log("addUsersToRole", response);
        if (response && response.error) {
          await store.dispatch("defineNotification", {
            message: `${JSON.stringify(response)}`,
            error: true,
          });
        } else {
          await store.dispatch("defineNotification", {
            message: `Added ${idsToAddToRole.value.size} users to role ${role.value.name} successfully`,
            success: true,
          });
        }
        // reload onMounted
        await loadPage.value();
      } catch (e: any) {
        if (e.message) {
          await store.dispatch("defineNotification", {
            message: e.message,
            error: true,
          });
        } else {
          console.warn("addUsersToRole", e);
        }
      }
    }
  }
};

const filteredUsers = computed(() => {
  // remove from allUsers, users present in roleUsers
  const roleUsersIds = roleUsers.value.map(user => user.id);
  return allUsers.value.reduce((acc: typeof allUsers.value, user) => {
    if (roleUsersIds.indexOf(user.id) === -1) {
      acc.push(user);
    }
    return acc;
  }, []);
});

const filterUsers = async () => {
  const urlParams = new URLSearchParams();
  if (pageables.searchTerm !== "") {
    urlParams.set("searchTerm", pageables.searchTerm);
  }
  urlParams.set("pageIndex", `${pageables.currentPage}`);
  urlParams.set("pageSize", `${pageables.recordsPerPage}`);
  urlParams.set("order", pageables.sort);
  urlParams.set("sort", pageables.sort);
  try {
    await store.dispatch("getUsers", `?${urlParams.toString()}`);
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

const sortUsers = async () => {
  if (pageables.sort === "ASC") {
    pageables.sort = "DESC";
  } else if (pageables.sort === "DESC") {
    pageables.sort = "ASC";
  }
  await filterUsers();
};

const searchUsers = async () => {
  await filterUsers();
};

watch(
  () => pageables.searchTerm,
  async searchTerm => {
    console.log(searchTerm);
    await filterUsers();
  }
);
</script>
