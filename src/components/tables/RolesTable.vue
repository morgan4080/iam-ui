<script setup lang="ts">
import { storeToRefs } from "pinia";
import CustomCard from "@/components/common/CustomCard.vue";
import DropDownMenu from "@/components/common/DropDownMenu.vue";
import { computed, ref } from "vue";
import { useSearch } from "@/composables/useSearch";
import { useRoles } from "@roles/composables/useRoles";
import { Role } from "@roles/types";
import { useRouter } from "vue-router";
const router = useRouter();
const {
  fetchRoles,
  pageables,
  changeVisibility,
  setLabel,
  setApplicationType,
  getLabels,
  getApplications,
  clearPageables,
} = useRoles();
const { search } = useSearch(pageables, fetchRoles);
const {
  roles,
  labels,
  selectedApplication,
  selectedLabel,
  headers,
  isLoading,
  applications,
} = storeToRefs(useRoles());

const emit = defineEmits(["selectRole", "deleteRole"]);

type optionsType = {
  page: number;
  itemsPerPage: number;
  sortBy: [];
  groupBy: [];
  search: string;
};

const loadItems = (options: optionsType) => {
  pageables.recordsPerPage = options.itemsPerPage;
  pageables.currentPage = options.page - 1;
  fetchRoles();
  getLabels();
  getApplications();
};

const showDateRange = ref(false);
const dateRange = ref([]);

const searchDateRange = () => {
  showDateRange.value = false;
  search();
};

const submitAction = (name: string, role: Role) => {
  switch (name) {
    case "view":
      router.push(`/roles/${role.id}/view`);
      break;
    case "edit":
      router.push(`/roles/${role.id}/edit`);
      break;
    case "role":
      emit("selectRole", role);
      break;
    case "delete":
      console.log("delete role", role);
      break;
  }
};

const serverItems = computed(() => {
  let data: any[] = [];
  if (roles.value) {
    data = roles.value.map(role => {
      return {
        ...role,
        actions: [
          {
            name: "view",
            icon: "mdi-eye",
          },
          {
            name: "edit",
            icon: "mdi-pencil",
          },
        ],
      };
    });
  }
  return data;
});
</script>

<template>
  <div>
    <CustomCard
      title="Roles Listing"
      sub-title="A List Of All Your Roles"
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
              type="search"
              placeholder="Search Role"
              class="bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
            />
          </v-input>
        </div>
      </template>
      <v-col
        cols="auto"
        sm="12"
        class="pt-10 pb-8"
      >
        <v-row class="d-flex gap-4 justify-start">
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
                {{ selectedLabel ? selectedLabel.name : "Select Group" }}
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
                {{
                  selectedApplication
                    ? selectedApplication.name
                    : "Select App Access"
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
                  v-for="(group, it) in applications"
                  :key="it"
                  :value="it"
                  density="compact"
                  size="small"
                  class="text-caption"
                  @click="
                    setApplicationType(group);
                    search();
                  "
                >
                  {{ group.name }}
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
            "
          >
            Clear Filters
          </v-btn>
          <v-spacer />
          <v-menu transition="slide-y-transition">
            <template #activator="{ props }">
              <v-btn
                variant="outlined"
                append-icon="mdi:mdi-chevron-down"
                v-bind="props"
                density="compact"
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
                  @click="changeVisibility(item.key)"
                >
                  <v-icon
                    v-if="item.visible"
                    icon="mdi:mdi-check"
                  />
                  {{ item.title }}</v-list-item
                >
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
                style="
                  border: 1px solid rgba(128, 128, 128, 0.25);
                  display: none;
                "
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
      <v-data-table-server
        id="activity-logs"
        class="text-caption"
        :items-per-page="pageables.recordsPerPage"
        :headers="headers as any"
        :items-length="pageables.totalRecords"
        :items="serverItems"
        :loading="isLoading"
        :search="pageables.searchTerm"
        item-value="id"
        no-data-text="No data available"
        loading-text="loading"
        :items-per-page-text="'Show'"
        :page-text="'entries'"
        :first-icon="''"
        :last-icon="''"
        :show-current-page="true"
        :items-per-page-options="[
          {
            title: '5',
            value: 5,
          },
          {
            title: '10',
            value: 10,
          },
          {
            title: '50',
            value: 50,
          },
        ]"
        @update:options="loadItems"
      >
        <template #[`item.userCount`]="{ item }">
          <v-chip
            density="compact"
            variant="outlined"
            :label="true"
            color="secondary"
            class="text-caption"
            @click="$router.push(`users?keycloakRoleId=${item.raw.keycloakId}`)"
          >
            <span class="cursor-pointer">{{
              item.raw.userCount ? item.raw.userCount : "_"
            }}</span>
          </v-chip>
        </template>
        <template #[`item.name`]="{ item }">
          <p class="max-w-xs text-caption">{{ item.raw.name }}</p>
        </template>
        <template #[`item.description`]="{ item }">
          <p class="max-w-xs text-caption">{{ item.raw.description }}</p>
        </template>
        <template #[`item.services`]="{ item }">
          <v-chip
            v-for="(service, i) in item.raw.services"
            :key="i"
            :label="true"
            color="primary"
            variant="outlined"
            density="compact"
            class="text-caption"
          >
            {{ service }}
          </v-chip>
        </template>
        <template #[`item.groupName`]="{ item }">
          <v-chip
            :label="true"
            color="primary"
            variant="outlined"
            density="compact"
            class="text-caption"
          >
            {{ item.raw.groupName ? item.raw.groupName.toUpperCase() : "_" }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            v-for="(btn, i) in item.raw.actions"
            :key="i"
            variant="outlined"
            density="compact"
            size="small"
            class="action-btn action-btn-icon mx-0.5"
            :color="btn.name == 'delete' ? 'error' : 'secondary'"
            @click="submitAction(btn.name, item.raw)"
          >
            <v-icon :icon="btn.icon" />
          </v-btn>
        </template>
      </v-data-table-server>
    </CustomCard>
  </div>
</template>

<style scoped></style>
