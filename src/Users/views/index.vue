<script setup lang="ts">
import FixedHeader from "@/components/common/FixedHeader.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import { useSearch } from "@/composables/useSearch";
import { useUsers } from "@users/composables/useUsers";
import UsersTable from "@/components/tables/UsersTable.vue";
import AssignRoleOverlay from "@/components/overlays/AssignRoleOverlay.vue";
import { User } from "@users/types";
const { users, pageables, isLoading, fetchUsers, syncUsers, deleteUser } =
  useUsers();
const { search } = useSearch(pageables, fetchUsers);
const router = useRouter();

const loading = ref(isLoading);
const showOverlay = ref(false);
const selectedUser = ref<User | null>(null);

const setSelectedUser = (user: User) => {
  selectedUser.value = user;
  showOverlay.value = !showOverlay.value;
};

const headers = ref([
  {
    title: "User",
    key: "user",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Username/USSD",
    key: "username",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Access",
    key: "access",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Group",
    key: "group",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Status",
    key: "status",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Actions",
    key: "actions",
    align: "start",
    sortable: false,
    visible: true,
  },
]);
</script>

<template>
  <FixedHeader
    title="Users Management"
    sub-title="Configuration For Users"
  >
    <template #buttons>
      <v-btn
        :loading="loading"
        variant="outlined"
        color="none"
        class="text-none text-caption mx-2"
        @click="fetchUsers"
      >
        Refresh
      </v-btn>
      <v-btn
        :loading="loading"
        variant="outlined"
        color="info"
        class="text-none text-caption mx-2"
        @click="syncUsers"
      >
        Sync
      </v-btn>
      <v-btn
        :loading="loading"
        variant="flat"
        color="primary"
        class="text-none text-caption mx-2"
        @click="router.push('/users/create')"
      >
        Add Web User
      </v-btn>
    </template>
  </FixedHeader>

  <v-container :fluid="true">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="12"
      >
        <CustomCard
          title="Users Listing"
          sub-title="Users Listing"
        >
          <template #search>
            <div class="align-center d-flex w-full md:w-1/5">
              <v-input
                hide-details
                class="font-weight-light"
                density="compact"
              >
                <template #default>
                  <v-input
                    append-icon="mdi-magnify"
                    class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
                    hide-details="auto"
                  >
                    <input
                      v-model="pageables.searchTerm"
                      type="text"
                      class="bg-transparent focus:ring-0 text-caption"
                      placeholder="Search"
                      @input="search"
                    />
                  </v-input>
                </template>
              </v-input>
            </div>
          </template>

          <UsersTable
            :headers="headers"
            :user-list="users"
            :pagination-data="pageables"
            :is-loading="isLoading"
            @fetch-users="fetchUsers"
            @update-items-per-page="pageables.recordsPerPage = $event"
            @update-page="pageables.currentPage = $event"
            @delete-user="deleteUser"
            @select-user="setSelectedUser"
          />
        </CustomCard>
      </v-col>
    </v-row>
  </v-container>
  <AssignRoleOverlay
    :is-loading="isLoading"
    :show-overlay="showOverlay"
    :selected-user="selectedUser"
  />
</template>
