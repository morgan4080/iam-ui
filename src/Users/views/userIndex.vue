<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useUsers } from "@/Users/composables/useUsers";
import Table from "../../components/ui/Table.vue";
import TableActions from "../../components/ui/TableActions.vue";
import { useRouter } from "vue-router";
import { User } from "@/Users/types";
import { mapActions } from "@/modules/mapStore";
import { usePagination } from "@/composables/usePagination";
import { useSort } from "@/composables/useSort";

const router = useRouter();
const { users, pageables, isLoading, fetchUsers, deleteUser, syncUsers } =
  useUsers();
const { next, previous } = usePagination(pageables, fetchUsers);
const { sort } = useSort(pageables, fetchUsers);
const { defineNotification } = mapActions();
const tableHeaders = [
  "Name",
  "Username",
  "USSD",
  "Web Access",
  "USSD Access",
  "Status",
];

async function searchUsers() {
  if (pageables.searchTerm?.length === 0) {
    pageables.searchTerm = null;
  }
  pageables.currentPage = 0;
  await fetchUsers();
}

async function delUser(user: User) {
  if (
    !confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}`
    )
  )
    return;
  await deleteUser(user.keycloakId)
    .then(async (response: string) => {
      if (response) {
        defineNotification({
          message: "User deleted successfully",
          success: true,
        });
        await fetchUsers();
      } else {
        defineNotification({
          message: "User deleted successfully",
          success: true,
        });
      }
    })
    .catch(error => {
      defineNotification({ message: error, error: true });
    });
}

async function sync() {
  const payload = {
    syncAllUsers: true,
  };
  await syncUsers(payload)
    .then(async response => {
      if (response) {
        await defineNotification({
          message: `Users synced successfully`,
          success: true,
        });
        pageables.currentPage = 0;
        await fetchUsers();
      }
    })
    .catch(async (error: string) => {
      await defineNotification({
        message: error,
        error: true,
      });
    });
}

onBeforeMount(async () => await fetchUsers());
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 w-full py-6">
    <TableActions
      :pageables="pageables"
      title="Users"
      description=" A list of all the users including their name, username, ussd and web access details."
      :loading="isLoading"
      @sort="sort"
      @search="searchUsers"
      @sync="sync"
    >
      <template #actionButton>
        <button
          class="block rounded-md bg-blue-500 hover:bg-blue-700 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm"
          type="button"
          @click="router.push('/users/create')"
        >
          Add user
        </button>
      </template>
    </TableActions>
    <div class="mt-8 flow-root">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table
            v-if="users"
            :headers="tableHeaders"
            :pageables="pageables"
            :loading="isLoading"
            :data-length="users.length"
            @next="next"
            @previous="previous"
          >
            <template v-if="users.length && !isLoading">
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-200 hover:cursor-pointer"
                @click="router.push(`/users/${user.id}/view`)"
              >
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                >
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ user.username }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ user.ussdPhoneNumber }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ user.email ? "Yes" : "No" }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ user.ussdPhoneNumber ? "Yes" : "No" }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      user.isEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ user.isEnabled ? "Enabled" : "Disabled" }}
                  </span>
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  @click="e => e.stopPropagation()"
                >
                  <div class="flex space-x-4 justify-center">
                    <router-link
                      :to="`/users/${user.id}/edit`"
                      class="text-indigo-600 hover:text-indigo-900"
                      >Edit
                      <span class="sr-only">, {{ user.firstName }}</span>
                    </router-link>
                    <a
                      class="text-red-600 hover:text-red-900"
                      @click.prevent="delUser(user)"
                    >
                      Delete
                      <span class="sr-only"> {{ user.firstName }}</span>
                    </a>
                  </div>
                </td>
              </tr>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
