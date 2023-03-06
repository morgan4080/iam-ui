<script setup lang="ts">
import { onBeforeMount } from "vue";
import Table from "@ui/Table.vue";
import TableActions from "@ui/TableActions.vue";
import { useRouter } from "vue-router";
import { mapActions } from "@/modules/mapStore";
import { useRoles } from "@/Roles/composables/useRoles";
import { syncRoles, syncServices } from "@/modules/all";
import store from "@/store";
import { usePagination } from "@/composables/usePagination";
import { useSort } from "@/composables/useSort";
import { useSearch } from "@/composables/useSearch";

const router = useRouter();
const { roles, pageables, isLoading, fetchRoles } = useRoles();
const { next, previous } = usePagination(pageables, fetchRoles);
const { sort } = useSort(pageables, fetchRoles);
const { search } = useSearch(pageables, fetchRoles);
const tableHeaders = ["Name", "Type", "Description"];

async function sync() {
  await syncServices();
  const response: any = await syncRoles();
  await store.dispatch("defineNotification", {
    message: response.message,
    success: true,
  });
}

onBeforeMount(async () => await fetchRoles());
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 w-full py-6">
    <TableActions
      :pageables="pageables"
      :loading="isLoading"
      title="Roles"
      description=" A list of all the roles including their type and description"
      @sort="sort"
      @search="search"
      @sync="sync"
    >
      <template #actionButton>
        <button
          type="button"
          class="block rounded-md bg-blue-500 hover:bg-blue-700 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm"
          @click="router.push('/roles/create')"
        >
          Add Role
        </button>
      </template>
    </TableActions>
    <div class="mt-8 flow-root">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table
            v-if="roles"
            :headers="tableHeaders"
            :pageables="pageables"
            :loading="isLoading"
            :data-length="roles.length"
            @next="next"
            @previous="previous"
          >
            <template v-if="roles.length && !isLoading">
              <tr
                v-for="role in roles"
                :key="role.id"
                class="hover:bg-gray-200 hover:cursor-pointer"
                @click="router.push(`/roles/${role.keycloakRoleId}`)"
              >
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                >
                  {{ role.name }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ role.roleType }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ role.description }}
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  @click="e => e.stopPropagation()"
                >
                  <router-link
                    :to="`/roles/${role.keycloakRoleId}/edit`"
                    class="text-indigo-600 hover:text-indigo-900"
                    >Edit
                    <span class="sr-only">, {{ role.description }}</span>
                  </router-link>
                </td>
              </tr>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
