<script setup lang="ts">
import FixedHeader from "@/components/common/FixedHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import { useSearch } from "@/composables/useSearch";
import { useUsers } from "@users/composables/useUsers";
import UsersTable from "@/components/tables/UsersTable.vue";
import AssignRoleOverlay from "@/components/overlays/AssignRoleOverlay.vue";
import { User } from "@users/types";
import { storeToRefs } from "pinia";
const {
  pageables,
  fetchUsers,
  syncUsers,
  deleteUser,
  clearPageables,
  changeVisibility,
  setLabel,
  setSelectedStatus,
  setAccessType,
  getLabels,
} = useUsers();
const {
  headers,
  users,
  isLoading,
  userTypes,
  statusTypes,
  labels,
  selectedAccessType,
  selectedStatus,
  selectedLabel,
} = storeToRefs(useUsers());
const { search } = useSearch(pageables, fetchUsers);
const router = useRouter();
const route = useRoute();
const showOverlay = ref(false);
const showDateRange = ref(false);
const dateRange = ref([]);
const selectedUser = ref<User | null>(null);

const setSelectedUser = (user: User) => {
  selectedUser.value = user;
  showOverlay.value = !showOverlay.value;
};

watch(dateRange, () => {
  if (dateRange.value && dateRange.value.length > 1) {
    pageables.startDate = (dateRange.value[0] as Date).toLocaleDateString(
      "en-GB"
    );
    pageables.endDate = (dateRange.value[1] as Date).toLocaleDateString(
      "en-GB"
    );
  } else if (dateRange.value && dateRange.value.length > 0) {
    try {
      pageables.startDate = (dateRange.value[0] as Date).toLocaleDateString(
        "en-GB"
      );
      pageables.endDate = (dateRange.value[0] as Date).toLocaleDateString(
        "en-GB"
      );
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

onMounted(() => {
  getLabels();
});

onMounted(() => {
  if (route.query.keycloakRoleId) {
    pageables.keycloakRoleId = `${route.query.keycloakRoleId}`;
    search();
  }
});
</script>

<template>
  <FixedHeader
    title="Users Management"
    sub-title="Configuration For Users"
  >
    <template #buttons>
      <v-btn
        :loading="isLoading"
        variant="outlined"
        color="none"
        class="text-none text-caption mx-2"
        @click="fetchUsers"
      >
        Refresh
      </v-btn>
      <v-btn
        :loading="isLoading"
        variant="outlined"
        color="info"
        class="text-none text-caption mx-2"
        @click="syncUsers"
      >
        Sync
      </v-btn>
      <v-btn
        :loading="isLoading"
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
      <CustomCard
        title="Users Listing"
        sub-title="Users Listing"
        class="px-0 py-0"
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
            <v-menu transition="slide-y-transition">
              <template #activator="{ props }">
                <v-btn
                  class="v-btn--size-default text-caption text-capitalize"
                  density="compact"
                  append-icon="mdi:mdi-chevron-down"
                  v-bind="props"
                  :flat="true"
                  style="border: 1px solid rgba(128, 128, 128, 0.25)"
                >
                  {{
                    selectedAccessType
                      ? selectedAccessType.name
                      : "Select Access type"
                  }}
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
                  size="small"
                >
                  <v-list-item
                    v-for="(type, it) in userTypes"
                    :key="it"
                    :value="it"
                    density="compact"
                    size="small"
                    class="text-caption"
                    @click="
                      setAccessType(type);
                      search();
                    "
                  >
                    {{ type.name }}
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
            <v-menu transition="slide-y-transition">
              <template #activator="{ props }">
                <v-btn
                  class="v-btn--size-default text-caption text-capitalize"
                  density="compact"
                  append-icon="mdi:mdi-chevron-down"
                  v-bind="props"
                  :flat="true"
                  style="border: 1px solid rgba(128, 128, 128, 0.25)"
                >
                  {{ selectedLabel ? selectedLabel.name : "Select Label" }}
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
                  size="small"
                >
                  <v-list-item
                    v-for="(label, it) in labels"
                    :key="it"
                    :value="it"
                    density="compact"
                    size="small"
                    class="text-caption"
                    @click="
                      setLabel(label);
                      search();
                    "
                  >
                    {{ label.name }}
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
            <v-menu transition="slide-y-transition">
              <template #activator="{ props }">
                <v-btn
                  class="v-btn--size-default text-caption text-capitalize"
                  density="compact"
                  append-icon="mdi:mdi-chevron-down"
                  v-bind="props"
                  :flat="true"
                  style="border: 1px solid rgba(128, 128, 128, 0.25)"
                >
                  {{ selectedStatus ? selectedStatus.name : "Select Status" }}
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
                  size="small"
                >
                  <v-list-item
                    v-for="(status, it) in statusTypes"
                    :key="it"
                    :value="it"
                    density="compact"
                    size="small"
                    class="text-caption"
                    @click="
                      setSelectedStatus(status);
                      search();
                    "
                  >
                    {{ status.name }}
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
            <v-btn
              class="v-btn--size-default text-caption text-capitalize"
              density="compact"
              append-icon="mdi:mdi-close"
              color="primary"
              variant="tonal"
              style="border: 1px solid rgba(128, 128, 128, 0.25)"
              @click="
                clearPageables();
                search();
                router.push('users');
              "
            >
              Clear Filters
            </v-btn>
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
                    dateRange = [];
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
    </v-row>
  </v-container>

  <Teleport to="body">
    <AssignRoleOverlay
      :is-loading="isLoading"
      :show-overlay="showOverlay"
      :selected-user="selectedUser"
      @hide-roles-overlay="
        showOverlay = false;
        clearPageables();
        search();
      "
    />
  </Teleport>
</template>
