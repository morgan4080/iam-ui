<template>
  <div class="flex items-start col-span-4">
    <div class="mt-1 sm:mt-0 flex-1">
      <div
        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
      >
        <p
          class="-mt-1 capitalize mb-2 text-sm font-medium text-gray-700 bg-gray-100"
        >
          Available Users
        </p>
        <ul class="list-decimal list-inside space-y-2">
          <li
            v-for="(user, index) in filteredUsers"
            :key="index"
            class="flex items-center justify-between"
          >
            <label :for="index">
              {{ user.firstName }} {{ user.lastName }}
            </label>
            <input
              :id="index"
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
        type="button"
        class="mx-4"
        @click="addUsersToRole"
      >
        <ArrowRightCircleIcon class="w-6 h-6" />
      </button>

      <button
        type="button"
        class="mx-4"
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
            <label :for="index">
              {{ user.firstName }} {{ user.lastName }}
            </label>
            <input
              :id="index"
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
} from "@heroicons/vue/24/solid";
import { computed, ComputedRef, ref, toRefs } from "vue";
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
</script>
