<script setup lang="ts">
import FixedHeader from "@/components/common/FixedHeader.vue";
import { useRouter } from "vue-router";
import { ref, computed, watch } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import { useSearch } from "@/composables/useSearch";
import { useUsers } from "@users/composables/useUsers";
import UsersTable from "@/components/tables/UsersTable.vue";
import AssignRoleOverlay from "@/components/overlays/AssignRoleOverlay.vue";
import { User } from "@users/types";
import DropDownMenu from "@/components/common/DropDownMenu.vue";
const { users, pageables, isLoading, fetchUsers, syncUsers, deleteUser } =
  useUsers();
const { search } = useSearch(pageables, fetchUsers);
const router = useRouter();

const loading = ref(isLoading);
const showOverlay = ref(false);
const showDateRange = ref(false);
const dateRange = ref(null);
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

const groups = computed(() => {
  return [
    {
      name: "Groups",
      value: null,
    },
  ];
});

const AccessTypes = computed(() => {
  return [
    {
      name: "Access Types",
      value: null,
    },
    {
      name: "Web",
      value: "WEB",
    },
    {
      name: "Mobile",
      value: "MOBILE",
    },
  ];
});

const statusTypes = computed(() => {
  return [
    {
      name: "Status",
      value: null,
    },
    {
      name: "Enabled",
      value: true,
    },
    {
      name: "Disabled",
      value: false,
    },
  ];
});

const selectedGroup = ref(groups.value[0]);
const selectedStatus = ref(statusTypes.value[0]);
const selectedAccessType = ref(AccessTypes.value[0]);

const setGroup = (group: typeof selectedGroup.value) => {
  selectedGroup.value = group;
};

const setAccessType = (access: typeof selectedAccessType.value) => {
  selectedAccessType.value = access;
};

const setSelectedStatus = (status: typeof selectedStatus.value) => {
  selectedStatus.value = status;
};

function changeVisibility(key: string) {
  headers.value.forEach(header => {
    if (header.key === key) {
      header.visible = !header.visible;
      header.align = header.align === " d-none" ? " start" : " d-none";
    }
  });
}

watch(dateRange, () => {
  if (dateRange.value.length > 1) {
    pageables.startDate = dateRange.value[0].toLocaleDateString("en-GB");
    pageables.endDate = dateRange.value[1].toLocaleDateString("en-GB");
  } else {
    try {
      pageables.startDate = dateRange.value[0].toLocaleDateString("en-GB");
      pageables.endDate = dateRange.value[0].toLocaleDateString("en-GB");
    } catch {
      pageables.startDate = null;
      pageables.endDate = null;
    }
  }
});

const searchDateRange = () => {
  showDateRange.value = false;
  search();
};
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
                append-icon="mdi-magnify"
                class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
                hide-details="auto"
              >
                <input
                  v-model="pageables.searchTerm"
                  type="text"
                  class="bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
                  placeholder="Search"
                  @input="search"
                />
              </v-input>
            </div>
          </template>

          <v-col
            cols="auto"
            sm="12"
            class="pt-8 pb-8"
          >
            <v-row class="d-flex pl-2 gap-4 justify-start">
              <DropDownMenu
                :selected="selectedAccessType"
                :groups="AccessTypes"
                @selected="setAccessType($event)"
              />
              <DropDownMenu
                :selected="selectedGroup"
                :groups="groups"
                @selected="setGroup($event)"
              />
              <DropDownMenu
                :selected="selectedStatus"
                :groups="statusTypes"
                @selected="setSelectedStatus($event)"
              />
              <v-spacer />

              <v-menu transition="slide-y-transition">
                <template #activator="{ props }">
                  <v-btn
                    density="compact"
                    variant="outlined"
                    append-icon="mdi:mdi-chevron-down"
                    v-bind="props"
                    class="mr-4 text-none text-caption"
                    style="border: 1px solid rgba(128, 128, 128, 0.25)"
                  >
                    Show / Hide
                  </v-btn>
                </template>
                <v-sheet
                  border
                  rounded
                >
                  <v-list
                    :nav="true"
                    density="compact"
                    role="listbox"
                  >
                    <v-list-item
                      v-for="(item, idx) in headers"
                      :key="idx"
                      :value="item"
                      density="compact"
                      class="text-caption"
                      size="small"
                      @click="changeVisibility(item.key)"
                    >
                      <v-icon
                        v-if="item.visible"
                        icon="mdi:mdi-check"
                        size="x-small"
                        class="pr-1"
                      />
                      {{ item.title }}
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-menu>

              <v-menu
                v-model="showDateRange"
                transition="slide-y-transition"
                :close-on-content-click="false"
              >
                <template #activator="{ props }">
                  <v-btn
                    density="compact"
                    variant="outlined"
                    append-icon="mdi:mdi-chevron-down"
                    v-bind="props"
                    class="mr-4 text-none text-caption"
                    style="border: 1px solid rgba(128, 128, 128, 0.25)"
                  >
                    {{
                      pageables.startDate
                        ? `${pageables.startDate} - ${pageables.endDate}`
                        : "Date Added"
                    }}
                  </v-btn>
                </template>
                <v-sheet
                  border
                  rounded
                >
                  <v-date-picker
                    v-model="dateRange"
                    :multiple="true"
                    title="Select Date Range"
                    cancel-text="CLEAR"
                    @click:save="searchDateRange"
                    @click:cancel="
                      showDateRange = false;
                      dateRange = '';
                      pageables.startDate = null;
                      pageables.endDate = null;
                      search();
                    "
                  ></v-date-picker>
                </v-sheet>
              </v-menu>
            </v-row>
          </v-col>

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
    @hide-roles-overlay="showOverlay = false"
  />
</template>
